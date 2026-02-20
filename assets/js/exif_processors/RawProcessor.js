export class RawProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'WASM Exiv2 C++ Engine';
        this.engineClass = 'text-rose-400 font-mono';
        this.buttonText = 'Execute WASM Purge';
        this.exifCache = {};
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
    }

    setCache(cache) { 
        this.exifCache = cache; 
    }

    async getPreviewUrl() {
        try {
            // Secretly pull the JPEG thumbnail out of the RAW file to show the user
            const thumbBuffer = await window.exifr.thumbnail(this.file);
            if (thumbBuffer) return URL.createObjectURL(new Blob([thumbBuffer], {type: 'image/jpeg'}));
            throw new Error();
        } catch(e) {
            try {
                // UTIF Fallback for RAW sensor decoding if no thumbnail exists
                const buffer = await this.file.arrayBuffer();
                const ifds = window.UTIF.decode(buffer);
                window.UTIF.decodeImage(buffer, ifds[0]);
                const rgba = window.UTIF.toRGBA8(ifds[0]);
                const canvas = document.createElement('canvas');
                canvas.width = ifds[0].width; canvas.height = ifds[0].height;
                canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rgba.buffer), ifds[0].width, ifds[0].height), 0, 0);
                return canvas.toDataURL('image/png');
            } catch(err) { return null; }
        }
    }

    // THE LAZY-LOADER: Injects the C++ environment only when the user clicks the button
    async initializeWasmEngine() {
        return new Promise((resolve, reject) => {
            // Skip if we already loaded it during this session
            if (window.exiv2ModuleLoaded) return resolve();

            const script = document.createElement('script');
            script.src = '../assets/wasm/exiv2.js';
            
            script.onload = async () => {
                try {
                    // Initialize the Emscripten WebAssembly Module
                    // It exports a global factory function called 'exiv2' or 'Module'
                    if (typeof window.exiv2 === 'function') {
                        window.exiv2Module = await window.exiv2({
                            // Tell the JS file exactly where to find the .wasm binary
                            locateFile: (path) => {
                                if (path.endsWith('.wasm')) return '../assets/wasm/exiv2.wasm';
                                return path;
                            }
                        });
                    } else if (typeof window.Module === 'object') {
                        window.exiv2Module = window.Module;
                    }
                    window.exiv2ModuleLoaded = true;
                    resolve();
                } catch (e) {
                    reject(new Error("WASM engine initialization failed."));
                }
            };
            
            script.onerror = () => reject(new Error("exiv2.js not found. Please check your /assets/wasm/ path."));
            document.head.appendChild(script);
        });
    }

    async scrub() {
        if (!window.exiv2ModuleLoaded || !window.exiv2Module) {
            throw new Error("WASM Engine is not loaded.");
        }

        const arrayBuffer = await this.file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        try {
            // Emscripten's Virtual File System (MEMFS)
            const FS = window.exiv2Module.FS;
            const tempFileName = 'heavy_image' + this.ext.toLowerCase(); // e.g., heavy_image.cr2
            
            // 1. Write the physical RAW file into the browser's virtual RAM file system
            FS.writeFile(tempFileName, uint8Array);
            
            // 2. Execute the C++ Exiv2 Command Line Interface
            // 'rm' = remove metadata
            // '-a' = ALL metadata (EXIF, IPTC, XMP)
            if (typeof window.exiv2Module.callMain === 'function') {
                window.exiv2Module.callMain(['rm', '-a', tempFileName]);
            } else {
                throw new Error("Exiv2 callMain execution function not found in WASM build.");
            }

            // 3. Read the cleaned, completely stripped file back from the virtual system
            const cleanedData = FS.readFile(tempFileName);
            
            // 4. Garbage Collection: Delete the virtual file to free up RAM
            FS.unlink(tempFileName);
            
            // 5. Package it and send it to the UI for download
            return new Blob([cleanedData], { type: this.file.type || '' });

        } catch (e) {
            console.error("WASM Execution Error:", e);
            throw new Error("WASM Engine failed to process the file.");
        }
    }
}

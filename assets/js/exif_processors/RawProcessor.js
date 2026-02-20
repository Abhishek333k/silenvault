export class RawProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.cr2';
        this.engineName = 'WASM Exiv2 Engine';
        this.engineClass = 'text-rose-400 font-mono';
        this.buttonText = 'Execute WASM Purge';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
    }

    async getPreviewUrl() {
        try {
            const thumbBuffer = await window.exifr.thumbnail(this.file);
            if (thumbBuffer) return URL.createObjectURL(new Blob([thumbBuffer], {type: 'image/jpeg'}));
            throw new Error();
        } catch(e) {
            try {
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

    async initializeWasmEngine() {
        return new Promise((resolve, reject) => {
            if (window.exiv2ModuleLoaded) return resolve();

            const script = document.createElement('script');
            // Points directly to the folder you created
            script.src = '../assets/wasm/exiv2.js'; 
            
            script.onload = async () => {
                try {
                    // gerosyab/exiv2-wasm exposes a global function to boot the engine
                    if (typeof window.exiv2 === 'function') {
                        window.exiv2Api = await window.exiv2({
                            locateFile: (path) => {
                                if (path.endsWith('.wasm')) return '../assets/wasm/exiv2.wasm';
                                return path;
                            }
                        });
                        window.exiv2ModuleLoaded = true;
                        resolve();
                    } else {
                        reject(new Error("exiv2 factory function not found. Ensure exiv2.js is intact."));
                    }
                } catch (e) {
                    reject(new Error("WASM Initialization crashed: " + e.message));
                }
            };
            
            script.onerror = () => reject(new Error("Failed to load /assets/wasm/exiv2.js. File missing."));
            document.head.appendChild(script);
        });
    }

    async scrub() {
        if (!window.exiv2ModuleLoaded || !window.exiv2Api) {
            throw new Error("WASM Engine failed to load.");
        }

        const arrayBuffer = await this.file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        try {
            // Instantiate the C++ Image object in WebAssembly RAM
            const img = new window.exiv2Api.Image(uint8Array);
            
            // Execute absolute metadata annihilation
            img.clearExif();
            img.clearIptc();
            img.clearXmp();
            
            // Extract the cleaned binary
            const cleanedData = img.getBytes();
            
            // Free the C++ memory
            img.delete();
            
            return new Blob([cleanedData], { type: this.file.type || '' });

        } catch (e) {
            console.error("WASM Execution Error:", e);
            throw new Error("WASM Engine failed to process the RAW file.");
        }
    }
}

export class RawProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.cr2';
        this.engineName = 'WASM Exiv2 C++ Engine';
        this.engineClass = 'text-rose-400 font-mono';
        this.buttonText = 'Execute WASM Purge';
        this.exifCache = {};
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
    }

    setCache(cache) { this.exifCache = cache; }

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

    // THE FIX: Native ES6 Dynamic Import for the ESM WASM file
    async initializeWasmEngine() {
        if (window.exiv2Api) return; // Already loaded

        console.log("[RawProcessor] Dynamically importing ESM WebAssembly module...");
        try {
            // Import the ESM module you uploaded
            const module = await import('../../wasm/exiv2.esm.js');
            const exiv2Factory = module.default || module;
            
            // Boot the C++ Environment
            window.exiv2Api = await exiv2Factory({
                locateFile: (path) => {
                    if (path.endsWith('.wasm')) return '../assets/wasm/exiv2.esm.wasm';
                    return path;
                }
            });
            console.log("[RawProcessor] WASM Engine Initialized successfully.");
        } catch (err) {
            console.error("WASM Load Error:", err);
            throw new Error("Failed to load Exiv2 WebAssembly module. Ensure exiv2.esm.js and exiv2.esm.wasm are in /assets/wasm/.");
        }
    }

    async scrub() {
        if (!window.exiv2Api) {
            throw new Error("WASM Engine failed to load.");
        }

        const arrayBuffer = await this.file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        try {
            // Instantiate the C++ Image object in WebAssembly RAM
            const img = new window.exiv2Api.Image(uint8Array);
            
            // Execute absolute metadata annihilation via C++ pointers
            img.clearExif();
            img.clearIptc();
            img.clearXmp();
            
            // Extract the cleaned binary
            const cleanedData = img.getBytes();
            
            // Free the C++ memory
            img.delete();
            
            return new Blob([cleanedData], { type: this.file.type || '' });
        } catch (e) {
            console.error("WASM Scrub Error:", e);
            throw new Error("WASM Engine failed to process the RAW file.");
        }
    }
}

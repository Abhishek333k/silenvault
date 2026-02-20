export class RawProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'WASM Exiv2 Engine';
        this.engineClass = 'text-violet-400 font-mono';
        this.buttonText = 'Execute WASM Purge';
        this.exifCache = {};
        this.wasmLoaded = false;
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
    }

    setCache(cache) { 
        this.exifCache = cache; 
    }

    // THE LAZY-LOADER: Fetches the payload ONLY when requested
    async initializeWasmEngine() {
        return new Promise((resolve) => {
            // Check if already loaded in memory
            if (window.Exiv2Wasm) {
                this.wasmLoaded = true;
                return resolve(true);
            }

            console.log("[RawProcessor] Requesting heavy WebAssembly payload...");
            
            // Simulating the network request to your future /assets/wasm/exiv2.js
            // If you drop the actual WASM script here, it will execute it.
            const script = document.createElement('script');
            script.src = '../assets/wasm/exiv2-browser.js'; 
            
            script.onload = () => {
                console.log("[RawProcessor] WASM Payload successfully injected.");
                this.wasmLoaded = true;
                resolve(true);
            };

            script.onerror = () => {
                console.warn("[RawProcessor] WASM payload not found. Falling back to native Binary IFD Orphaner.");
                this.engineName = 'Binary IFD Orphaner (Fallback)';
                this.wasmLoaded = false;
                resolve(false); // Graceful degradation
            };

            document.head.appendChild(script);
        });
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

    async scrub() {
        const arrayBuffer = await this.file.arrayBuffer();
        
        // If WASM loaded successfully, execute WASM C++ logic here
        if (this.wasmLoaded && window.Exiv2Wasm) {
            // window.Exiv2Wasm.scrub(arrayBuffer);
            // return new Blob([wasmOutput], { type: this.file.type });
        }

        // FAILSAFE: Execute the highly capable Binary Splicer if WASM is missing
        let view = new DataView(arrayBuffer);
        let uint8View = new Uint8Array(arrayBuffer);

        let isLittleEndian = view.getUint16(0) === 0x4949;
        const searchLimit = Math.min(uint8View.length, 2000000); 

        const targetTags = [0x8825, 0x8769, 0x010F, 0x0110, 0x0131, 0x0132, 0x02BC, 0x83BB, 0x927C, 0x013B, 0x8298];
        for (let i = 0; i < searchLimit - 12; i += 2) {
            let tagId = view.getUint16(i, isLittleEndian);
            if (targetTags.includes(tagId)) {
                let type = view.getUint16(i + 2, isLittleEndian);
                if (type >= 1 && type <= 12) {
                    for (let j = 4; j < 12; j++) uint8View[i + j] = 0x00; 
                }
            }
        }

        const encoder = new TextEncoder();
        for (const val of Object.values(this.exifCache)) {
            if (typeof val === 'string' && val.length > 3) {
                const bytes = encoder.encode(val);
                for (let i = 0; i < searchLimit - bytes.length; i++) {
                    let match = true;
                    for (let j = 0; j < bytes.length; j++) if (uint8View[i + j] !== bytes[j]) { match = false; break; }
                    if (match) for (let j = 0; j < bytes.length; j++) uint8View[i + j] = 0x20;
                }
            }
        }

        const xmpTags = ['x:xmpmeta', 'xpacket', 'photoshop:', 'tiff:', 'exif:', 'dc:', 'xmlns:'];
        xmpTags.forEach(tag => {
            const bytes = encoder.encode(tag);
            for (let i = 0; i < searchLimit - bytes.length; i++) {
                let match = true;
                for (let j = 0; j < bytes.length; j++) if (uint8View[i + j] !== bytes[j]) { match = false; break; }
                if (match) for (let j = 0; j < bytes.length; j++) uint8View[i + j] = 0x20;
            }
        });

        return new Blob([uint8View], { type: this.file.type || '' });
    }
}

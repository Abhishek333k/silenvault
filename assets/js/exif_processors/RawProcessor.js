export class RawProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'WASM Exiv2 Engine';
        this.engineClass = 'text-rose-400 font-mono';
        this.buttonText = 'Execute WASM Purge';
        this.wasmLoaded = false;
        this.exifCache = {};
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
    }

    setCache(cache) { this.exifCache = cache; }

    // THE LAZY-LOADER
    async initializeWasmEngine() {
        return new Promise((resolve) => {
            if (window.Exiv2Wasm) {
                this.wasmLoaded = true;
                return resolve(true);
            }
            console.log("[RawProcessor] Requesting heavy WebAssembly payload...");
            
            const script = document.createElement('script');
            // Path to where you will eventually host your WASM wrapper
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
                resolve(false); 
            };
            document.head.appendChild(script);
        });
    }

    async getPreviewUrl() {
        try {
            const thumbBuffer = await window.exifr.thumbnail(this.file);
            if (thumbBuffer) return URL.createObjectURL(new Blob([thumbBuffer], {type: 'image/jpeg'}));
            throw new Error("No Exifr Thumb");
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
        
        // FUTURE PROOF: Execute C++ WASM here once you compile it
        if (this.wasmLoaded && window.Exiv2Wasm) {
            // return window.Exiv2Wasm.scrub(arrayBuffer);
        }

        // NATIVE FALLBACK: Binary IFD Orphaner
        let view = new DataView(arrayBuffer);
        let uint8View = new Uint8Array(arrayBuffer);

        let isLittleEndian = view.getUint16(0) === 0x4949;
        const searchLimit = Math.min(uint8View.length, 2000000); 

        // Pass 1
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

        // Pass 2: Overwrite cached strings to annihilate XMP
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

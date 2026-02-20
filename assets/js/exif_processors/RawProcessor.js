export class RawProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.cr2';
        this.engineName = 'WASM Exiv2 Engine / Native Wiper';
        this.engineClass = 'text-rose-400 font-mono';
        this.buttonText = 'Execute Deep Purge';
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
            script.src = '../assets/wasm/exiv2.js'; 
            
            script.onload = async () => {
                try {
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
                        reject(new Error("exiv2 factory function not found."));
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
        const arrayBuffer = await this.file.arrayBuffer();
        
        // ATTEMPT 1: Try the C++ Exiv2 Engine
        if (window.exiv2ModuleLoaded && window.exiv2Api) {
            try {
                console.log("[RawProcessor] Attempting WASM C++ Exiv2 Purge...");
                const img = new window.exiv2Api.Image(new Uint8Array(arrayBuffer));
                img.clearExif();
                img.clearIptc();
                img.clearXmp();
                const cleanedData = img.getBytes();
                img.delete();
                return new Blob([cleanedData], { type: this.file.type || '' });
            } catch (e) {
                // Exiv2 throws an error when modifying read-only formats like CR2.
                console.warn("[RawProcessor] Exiv2 rejected the format. Engaging Native Deep TIFF Wiper fallback.");
            }
        }

        // ATTEMPT 2: The Native Deep TIFF Wiper
        console.log("[RawProcessor] Executing Native Deep TIFF Wiper...");
        const wipedBuffer = this.runNativeTiffWiper(arrayBuffer);
        return new Blob([wipedBuffer], { type: this.file.type || '' });
    }

    runNativeTiffWiper(arrayBuffer) {
        let dataView = new DataView(arrayBuffer);
        let uint8Array = new Uint8Array(arrayBuffer);
        let isLittle = dataView.getUint16(0) === 0x4949; 
        const searchLimit = Math.min(uint8Array.length, 5000000); 

        // CRITICAL STRUCTURAL TAGS: These must NOT be deleted, or the sensor data corrupts.
        const structuralTags = [
            0x00FE, 0x0100, 0x0101, 0x0102, 0x0103, 0x0106, 0x0111, 0x0112, 0x0115, 0x0116, 0x0117,
            0x011A, 0x011B, 0x011C, 0x0128, 0x014A, 0x0214, 0x0133, 0x0142, 0x0143, 0x0144,
            0x828D, 0x828E, 0x9216, 0xC612, 0xC613, 0xC614, 0xC615, 0xC61F, 0xC620, 0xC621,
            0xC622, 0xC623, 0xC624, 0xC627, 0xC628, 0xC62A, 0xC62B, 0xC62C, 0xC62D, 0xC62E,
            0xC62F, 0xC630, 0xC632, 0xC633, 0xC634, 0xC635, 0xC65A, 0xC65B, 0xC68D, 0xC68E
        ];

        // 1. Recursive IFD Pointer Orphaning
        const wipeIfd = (offset) => {
            if (offset === 0 || offset >= dataView.byteLength - 2) return;
            const numEntries = dataView.getUint16(offset, isLittle);
            let currentOffset = offset + 2;

            for (let i = 0; i < numEntries; i++) {
                if (currentOffset + 12 > dataView.byteLength) break;
                const tagId = dataView.getUint16(currentOffset, isLittle);

                if (tagId === 0x8769 || tagId === 0x8825 || tagId === 0x02BC) { 
                    // ExifOffset, GPSOffset, XMP - Destroy sub-directories
                    const subOffset = dataView.getUint32(currentOffset + 8, isLittle);
                    if(subOffset > 0 && subOffset < dataView.byteLength) wipeIfd(subOffset);
                    for (let j = 0; j < 12; j++) uint8Array[currentOffset + j] = 0;
                } else if (!structuralTags.includes(tagId)) {
                    // Destroy privacy tag
                    for (let j = 0; j < 12; j++) uint8Array[currentOffset + j] = 0;
                }
                currentOffset += 12;
            }
            if (currentOffset + 4 <= dataView.byteLength) {
                const nextIfd = dataView.getUint32(currentOffset, isLittle);
                if (nextIfd > 0 && nextIfd < dataView.byteLength) wipeIfd(nextIfd);
            }
        };

        try {
            let firstIfdOffset = dataView.getUint32(4, isLittle);
            wipeIfd(firstIfdOffset);
        } catch(e) { console.error("IFD wipe failed", e); }

        const encoder = new TextEncoder();

        // 2. Overwrite cached text strings (MakerNotes, Serial Numbers)
        for (const val of Object.values(this.exifCache)) {
            if (typeof val === 'string' && val.length > 3) {
                const bytes = encoder.encode(val);
                for (let i = 0; i < searchLimit - bytes.length; i++) {
                    let match = true;
                    for (let j = 0; j < bytes.length; j++) {
                        if (uint8Array[i + j] !== bytes[j]) { match = false; break; }
                    }
                    if (match) {
                        for (let j = 0; j < bytes.length; j++) uint8Array[i + j] = 0x20;
                    }
                }
            }
        }

        // 3. Absolute XMP XML Annihilation
        const xmpStart = encoder.encode('<?xpacket begin');
        const xmpEnd = encoder.encode('<?xpacket end');
        
        for (let i = 0; i < searchLimit - xmpStart.length; i++) {
            let match = true;
            for (let j = 0; j < xmpStart.length; j++) {
                if (uint8Array[i + j] !== xmpStart[j]) { match = false; break; }
            }
            if (match) {
                let endIdx = -1;
                for (let k = i; k < searchLimit - xmpEnd.length; k++) {
                    let endMatch = true;
                    for (let j = 0; j < xmpEnd.length; j++) {
                        if (uint8Array[k + j] !== xmpEnd[j]) { endMatch = false; break; }
                    }
                    if (endMatch) { endIdx = k + 50; break; } // +50 clears the closing bracket
                }
                if (endIdx !== -1) {
                    for (let n = i; n < endIdx; n++) uint8Array[n] = 0x20; // Overwrite entire packet with spaces
                }
            }
        }

        return uint8Array;
    }
}

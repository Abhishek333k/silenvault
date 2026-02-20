export class RawProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.cr2';
        this.engineName = 'WASM Exiv2 / Native TIFF Wiper';
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

    // Attempts to load the ESM module you uploaded. Doesn't crash if it fails.
    async initializeWasmEngine() {
        if (window.exiv2Api) return; 

        console.log("[RawProcessor] Attempting to import WASM Module...");
        try {
            const module = await import('../../wasm/exiv2.esm.js');
            const exiv2Factory = module.default || module;
            
            window.exiv2Api = await exiv2Factory({
                locateFile: (path) => {
                    if (path.endsWith('.wasm')) return '../assets/wasm/exiv2.esm.wasm';
                    return path;
                }
            });
            console.log("[RawProcessor] WASM Engine Initialized successfully.");
        } catch (err) {
            console.warn("[RawProcessor] WASM skipped or failed. Relying on Native TIFF Wiper.", err);
        }
    }

    async scrub() {
        const arrayBuffer = await this.file.arrayBuffer();
        
        // 1. ATTEMPT WASM EXIV2 PURGE
        if (window.exiv2Api) {
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
                // Exiv2 actively rejects modifying CR2 files to prevent corruption. 
                console.warn("[RawProcessor] WASM Exiv2 rejected the format. Engaging Native TIFF Wiper fallback.");
            }
        }

        // 2. THE TRUE NATIVE TIFF WIPER (Executes when Exiv2 fails on CR2)
        console.log("[RawProcessor] Executing Native Deep TIFF Wiper...");
        const wipedBuffer = this.runNativeTiffWiper(arrayBuffer);
        return new Blob([wipedBuffer], { type: this.file.type || '' });
    }

    runNativeTiffWiper(arrayBuffer) {
        let dataView = new DataView(arrayBuffer);
        let uint8Array = new Uint8Array(arrayBuffer);
        let isLittle = dataView.getUint16(0) === 0x4949; // Check Endianness ('II' vs 'MM')

        // CRITICAL STRUCTURAL TAGS: We must leave these intact so the RAW sensor data remains readable.
        const structuralTags = [
            0x00FE, 0x0100, 0x0101, 0x0102, 0x0103, 0x0106, 0x0111, 0x0112, 0x0115, 0x0116, 0x0117,
            0x011A, 0x011B, 0x011C, 0x0128, 0x014A, 0x0214, 0x0133, 0x0142, 0x0143, 0x0144,
            0x828D, 0x828E, 0x9216, 0xC612, 0xC613, 0xC614, 0xC615, 0xC61F, 0xC620, 0xC621,
            0xC622, 0xC623, 0xC624, 0xC627, 0xC628, 0xC62A, 0xC62B, 0xC62C, 0xC62D, 0xC62E,
            0xC62F, 0xC630, 0xC632, 0xC633, 0xC634, 0xC635, 0xC65A, 0xC65B, 0xC68D, 0xC68E
        ];

        // Recursive function to walk the Image File Directories (IFDs)
        const wipeIfd = (offset) => {
            if (offset === 0 || offset >= dataView.byteLength - 2) return;
            const numEntries = dataView.getUint16(offset, isLittle);
            let currentOffset = offset + 2;

            for (let i = 0; i < numEntries; i++) {
                if (currentOffset + 12 > dataView.byteLength) break;
                const tagId = dataView.getUint16(currentOffset, isLittle);

                // If we find ExifOffset (0x8769), GPSOffset (0x8825), or XMP (0x02BC)
                if (tagId === 0x8769 || tagId === 0x8825 || tagId === 0x02BC) {
                    const subOffset = dataView.getUint32(currentOffset + 8, isLittle);
                    if(subOffset > 0 && subOffset < dataView.byteLength) wipeIfd(subOffset);
                    
                    // Nuke the pointer
                    for (let j = 0; j < 12; j++) uint8Array[currentOffset + j] = 0;
                } 
                // If it's a metadata tag (Make, Model, Software) and NOT a structural tag
                else if (!structuralTags.includes(tagId)) {
                    // Nuke the entry
                    for (let j = 0; j < 12; j++) uint8Array[currentOffset + j] = 0;
                }
                currentOffset += 12;
            }

            // Move to the next IFD block
            if (currentOffset + 4 <= dataView.byteLength) {
                const nextIfd = dataView.getUint32(currentOffset, isLittle);
                if (nextIfd > 0 && nextIfd < dataView.byteLength) wipeIfd(nextIfd);
            }
        };

        // 1. Execute IFD Tree wipe starting from the first offset
        let firstIfdOffset = dataView.getUint32(4, isLittle);
        wipeIfd(firstIfdOffset);

        // 2. Global XML XMP Annihilation (Fixes the 25 Adobe tags that survived)
        const encoder = new TextEncoder();
        const xmpStart = encoder.encode('<?xpacket begin');
        const xmpEnd = encoder.encode('<?xpacket end');
        
        let searchLimit = Math.min(uint8Array.length, 5000000); // Usually embedded in first 5MB
        
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
                    if (endMatch) { endIdx = k + 50; break; } // +50 to clear closing bracket
                }
                if (endIdx !== -1) {
                    // Overwrite the entire Adobe XML payload with empty spaces
                    for (let n = i; n < endIdx; n++) uint8Array[n] = 0x20; 
                }
            }
        }

        return uint8Array;
    }
}

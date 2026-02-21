export class RawProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.cr2';
        this.engineName = 'Double-Pass Wiper (WASM + Native)';
        this.engineClass = 'text-rose-400 font-mono';
        this.buttonText = 'Execute Double-Pass Wiper';
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

    async loadWasm() {
        if (window.exiv2Api) return; 
        try {
            const module = await import('../../wasm/exiv2.esm.js');
            const exiv2Factory = module.default || module;
            window.exiv2Api = await exiv2Factory({
                locateFile: (path) => {
                    if (path.endsWith('.wasm')) return '../assets/wasm/exiv2.esm.wasm';
                    return path;
                }
            });
        } catch (err) {
            console.warn("WASM Engine failed to load. Will rely entirely on Native Wiper.");
        }
    }

    async scrub() {
        let bufferToProcess = await this.file.arrayBuffer();
        
        // PASS 1: WASM C++ Engine
        if (window.exiv2Api) {
            try {
                const terminalOut = document.getElementById('terminal-out');
                if(terminalOut) terminalOut.innerHTML += `<div class="log-line"><span class="val-sys">> INITIATING PASS 1: WASM C++ ENGINE...</span></div>`;
                
                const img = new window.exiv2Api.Image(new Uint8Array(bufferToProcess));
                img.clearExif();
                img.clearIptc();
                img.clearXmp();
                bufferToProcess = img.getBytes().buffer; // Update buffer with WASM-cleaned data
                img.delete();
                
                if(terminalOut) {
                    terminalOut.innerHTML += `<div class="log-line"><span class="log-key">PASS 1</span><span class="val-safe">WASM EXECUTION SUCCESSFUL</span></div>`;
                    terminalOut.scrollTop = terminalOut.scrollHeight;
                }
            } catch (e) {
                const terminalOut = document.getElementById('terminal-out');
                if(terminalOut) {
                    terminalOut.innerHTML += `<div class="log-line"><span class="log-key">PASS 1</span><span class="val-med">WASM REJECTED FORMAT. BYPASSING TO NATIVE...</span></div>`;
                    terminalOut.scrollTop = terminalOut.scrollHeight;
                }
            }
        }

        // PASS 2: Native Deep TIFF Wiper
        const terminalOut = document.getElementById('terminal-out');
        if(terminalOut) {
            terminalOut.innerHTML += `<div class="log-line"><span class="val-sys">> INITIATING PASS 2: NATIVE DEEP TIFF WIPER...</span></div>`;
            terminalOut.scrollTop = terminalOut.scrollHeight;
        }
        
        const finalUint8Array = this.runNativeTiffWiper(bufferToProcess);
        
        if(terminalOut) {
            terminalOut.innerHTML += `<div class="log-line"><span class="log-key">PASS 2</span><span class="val-safe">NATIVE ORPHANING COMPLETE</span></div>`;
            terminalOut.scrollTop = terminalOut.scrollHeight;
        }

        return new Blob([finalUint8Array], { type: this.file.type || '' });
    }

    runNativeTiffWiper(arrayBuffer) {
        let dataView = new DataView(arrayBuffer);
        let uint8Array = new Uint8Array(arrayBuffer);
        let isLittle = dataView.getUint16(0) === 0x4949; 

        const structuralTags = [
            0x00FE, 0x0100, 0x0101, 0x0102, 0x0103, 0x0106, 0x0111, 0x0112, 0x0115, 0x0116, 0x0117,
            0x011A, 0x011B, 0x011C, 0x0128, 0x014A, 0x0214, 0x0133, 0x0142, 0x0143, 0x0144,
            0x828D, 0x828E, 0x9216, 0xC612, 0xC613, 0xC614, 0xC615, 0xC61F, 0xC620, 0xC621,
            0xC622, 0xC623, 0xC624, 0xC627, 0xC628, 0xC62A, 0xC62B, 0xC62C, 0xC62D, 0xC62E,
            0xC62F, 0xC630, 0xC632, 0xC633, 0xC634, 0xC635, 0xC65A, 0xC65B, 0xC68D, 0xC68E
        ];

        const wipeIfd = (offset) => {
            if (offset === 0 || offset >= dataView.byteLength - 2) return;
            const numEntries = dataView.getUint16(offset, isLittle);
            let currentOffset = offset + 2;

            for (let i = 0; i < numEntries; i++) {
                if (currentOffset + 12 > dataView.byteLength) break;
                const tagId = dataView.getUint16(currentOffset, isLittle);
                const type = dataView.getUint16(currentOffset + 2, isLittle);
                const count = dataView.getUint32(currentOffset + 4, isLittle);
                const valueOffset = dataView.getUint32(currentOffset + 8, isLittle);

                let bytesPerComponent = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 1;
                let totalSize = count * bytesPerComponent;

                if (tagId === 0x8769 || tagId === 0x8825 || tagId === 0x927C || tagId === 0x02BC) { 
                    if(valueOffset > 0 && valueOffset < dataView.byteLength && type === 4) wipeIfd(valueOffset);
                    for (let j = 0; j < 12; j++) uint8Array[currentOffset + j] = 0;
                } else if (!structuralTags.includes(tagId)) {
                    if (totalSize > 4 && valueOffset > 0 && valueOffset + totalSize <= dataView.byteLength) {
                        for (let j = 0; j < totalSize; j++) uint8Array[valueOffset + j] = 0;
                    }
                    for (let j = 0; j < 12; j++) uint8Array[currentOffset + j] = 0;
                }
                currentOffset += 12;
            }
            if (currentOffset + 4 <= dataView.byteLength) {
                const nextIfd = dataView.getUint32(currentOffset, isLittle);
                if (nextIfd > 0 && nextIfd < dataView.byteLength) wipeIfd(nextIfd);
            }
        };

        try { wipeIfd(dataView.getUint32(4, isLittle)); } catch(e) {}

        const encoder = new TextEncoder();
        const targets = ['<?xpacket', 'x:xmpmeta', 'http://ns.adobe.com', 'Exif', 'Canon', 'Nikon', 'Sony'];
        Object.values(this.exifCache).forEach(val => { if (typeof val === 'string' && val.length > 3) targets.push(val); });

        targets.forEach(str => {
            const bytes = encoder.encode(str);
            for (let i = 0; i < uint8Array.length - bytes.length; i++) {
                let match = true;
                for (let j = 0; j < bytes.length; j++) if (uint8Array[i + j] !== bytes[j]) { match = false; break; }
                if (match) {
                    for (let j = 0; j < Math.min(1000, uint8Array.length - i); j++) {
                        if (uint8Array[i + j] === 0) break;
                        uint8Array[i + j] = 0x20; 
                    }
                }
            }
        });

        return uint8Array;
    }
}

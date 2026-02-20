export class RawProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'Dual-Pass Forensic Wiper';
        this.engineClass = 'text-violet-400 font-mono';
        this.buttonText = 'Execute Binary Splicer';
        this.exifCache = {}; // Fed by UI
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
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

    setCache(cache) {
        this.exifCache = cache;
    }

    async scrub() {
        const arrayBuffer = await this.file.arrayBuffer();
        let view = new DataView(arrayBuffer);
        let uint8View = new Uint8Array(arrayBuffer);

        let isLittleEndian = true;
        if (view.getUint16(0) === 0x4949) isLittleEndian = true;
        else if (view.getUint16(0) === 0x4D4D) isLittleEndian = false;

        const searchLimit = Math.min(uint8View.length, 2000000); 

        // Pass 1: IFD Pointer Orphaning
        const targetTags = [0x8825, 0x8769, 0x010F, 0x0110, 0x0131, 0x0132, 0x02BC, 0x83BB, 0x927C];
        for (let i = 0; i < searchLimit - 12; i += 2) {
            let tagId = view.getUint16(i, isLittleEndian);
            if (targetTags.includes(tagId)) {
                let type = view.getUint16(i + 2, isLittleEndian);
                if (type >= 1 && type <= 12) {
                    for (let j = 4; j < 12; j++) uint8View[i + j] = 0x00; 
                }
            }
        }

        // Pass 2: ASCII Overwriter
        const encoder = new TextEncoder();
        
        // 2a. Wipe known strings caught during parse
        for (const [key, val] of Object.entries(this.exifCache)) {
            if (typeof val === 'string' && val.length > 3) {
                const bytes = encoder.encode(val);
                for (let i = 0; i < searchLimit - bytes.length; i++) {
                    let match = true;
                    for (let j = 0; j < bytes.length; j++) {
                        if (uint8View[i + j] !== bytes[j]) { match = false; break; }
                    }
                    if (match) {
                        for (let j = 0; j < bytes.length; j++) uint8View[i + j] = 0x20;
                    }
                }
            }
        }

        // 2b. Wipe structural XMP wrappers
        const xmpTags = ['x:xmpmeta', 'xpacket', 'photoshop:', 'tiff:', 'exif:', 'dc:', 'xmlns:'];
        xmpTags.forEach(tag => {
            const bytes = encoder.encode(tag);
            for (let i = 0; i < searchLimit - bytes.length; i++) {
                let match = true;
                for (let j = 0; j < bytes.length; j++) {
                    if (uint8View[i + j] !== bytes[j]) { match = false; break; }
                }
                if (match) {
                    for (let j = 0; j < bytes.length; j++) uint8View[i + j] = 0x20;
                }
            }
        });

        return new Blob([uint8View], { type: this.file.type || '' });
    }
}

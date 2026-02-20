// assets/js/ExifProcessors.js

export class BaseProcessor {
    constructor(file, ext) { 
        this.file = file; 
        this.ext = ext; 
    }
    
    // Explicitly reads as ArrayBuffer to guarantee WebP RIFF chunks are found
    async parse() {
        const buffer = await this.file.arrayBuffer(); 
        return await exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
    }
    
    async getPreviewUrl() { 
        return URL.createObjectURL(this.file); 
    }
}

// Handles JPEG, PNG, and WEBP
export class CanvasProcessor extends BaseProcessor {
    constructor(file, ext, outputMime) { 
        super(file, ext); 
        this.outputMime = outputMime; // dynamically set to 'image/webp', 'image/jpeg', etc.
    }
    
    getEngineName() { 
        if (this.outputMime === 'image/webp') return 'WebP Canvas Engine';
        if (this.outputMime === 'image/png') return 'PNG Canvas Engine';
        return 'HTML5 Canvas API'; 
    }
    
    getEngineClass() { return 'text-blue-300 font-mono'; }
    getButtonText() { return 'Remove Metadata'; }
    
    async scrub(sourceImageObj) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = sourceImageObj.naturalWidth; 
        canvas.height = sourceImageObj.naturalHeight;
        ctx.drawImage(sourceImageObj, 0, 0);
        
        // WebP and JPEG support quality compression. PNG does not.
        const quality = (this.outputMime === 'image/jpeg' || this.outputMime === 'image/webp') ? 0.92 : undefined;
        
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), this.outputMime, quality); 
        });
    }
}

// Handles CR2, DNG, NEF, ARW
export class RawProcessor extends BaseProcessor {
    getEngineName() { return 'Forensic IFD Orphaner'; }
    getEngineClass() { return 'text-violet-400 font-mono'; }
    getButtonText() { return 'Execute Binary Splicer'; }
    
    async getPreviewUrl() {
        try {
            // Attempt fast Exifr thumbnail extraction
            const thumbBuffer = await exifr.thumbnail(this.file);
            if (thumbBuffer) return URL.createObjectURL(new Blob([thumbBuffer], {type: 'image/jpeg'}));
            throw new Error("No Exifr Thumb");
        } catch(e) {
            try {
                // Fallback: Secretly decode RAW sensor data via UTIF
                const buffer = await this.file.arrayBuffer();
                const ifds = UTIF.decode(buffer);
                UTIF.decodeImage(buffer, ifds[0]);
                const rgba = UTIF.toRGBA8(ifds[0]);
                
                const canvas = document.createElement('canvas');
                canvas.width = ifds[0].width; 
                canvas.height = ifds[0].height;
                canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rgba.buffer), ifds[0].width, ifds[0].height), 0, 0);
                
                return canvas.toDataURL('image/png');
            } catch(err) { return null; }
        }
    }

    async scrub() {
        const arrayBuffer = await this.file.arrayBuffer();
        let view = new DataView(arrayBuffer);
        let uint8View = new Uint8Array(arrayBuffer);

        let isLittleEndian = true;
        if (view.getUint16(0) === 0x4D4D) isLittleEndian = false;

        let orphanedCount = 0;
        // Targets: GPS, ExifOffset, Make, Model, Software, DateTime, XMP, IPTC
        const targetTags = [0x8825, 0x8769, 0x010F, 0x0110, 0x0131, 0x0132, 0x02BC, 0x83BB];
        const searchLimit = Math.min(uint8View.length, 1500000); 

        for (let i = 0; i < searchLimit - 12; i += 2) {
            let tagId = view.getUint16(i, isLittleEndian);
            if (targetTags.includes(tagId)) {
                let type = view.getUint16(i + 2, isLittleEndian);
                if (type >= 1 && type <= 12) {
                    for (let j = 4; j < 12; j++) uint8View[i + j] = 0x00; 
                    orphanedCount++;
                }
            }
        }
        return new Blob([uint8View], { type: this.file.type || '' });
    }
}

// The Router
export class ProcessorFactory {
    static create(file, ext) {
        // Here is your explicit format routing:
        if (['PNG'].includes(ext)) return new CanvasProcessor(file, ext, 'image/png');
        if (['WEBP'].includes(ext)) return new CanvasProcessor(file, ext, 'image/webp');
        if (['CR2', 'DNG', 'NEF', 'ARW'].includes(ext)) return new RawProcessor(file, ext);
        
        return new CanvasProcessor(file, ext, 'image/jpeg'); // Default
    }
}

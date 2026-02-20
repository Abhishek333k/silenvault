export class CanvasProcessor {
    constructor(file, ext, outputMime) {
        this.file = file;
        this.ext = ext;
        this.outputMime = outputMime || 'image/jpeg';
        this.engineName = 'HTML5 Canvas API';
        this.engineClass = 'text-blue-300 font-mono';
        this.buttonText = 'Remove Metadata';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, ifd0: true, exif: true, gps: true, xmp: true, iptc: true});
    }

    async getPreviewUrl() {
        // Safe extraction for standard fallbacks
        if (['CR2', 'DNG', 'NEF', 'ARW'].includes(this.ext.toUpperCase())) {
            try {
                const thumbBuffer = await window.exifr.thumbnail(this.file);
                return URL.createObjectURL(new Blob([thumbBuffer], {type: 'image/jpeg'}));
            } catch(e) { return null; }
        }
        return URL.createObjectURL(this.file);
    }

    async scrub(sourceImageObj) {
        const canvas = document.createElement('canvas');
        canvas.width = sourceImageObj.naturalWidth;
        canvas.height = sourceImageObj.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(sourceImageObj, 0, 0);
        
        const quality = (this.outputMime === 'image/jpeg' || this.outputMime === 'image/webp') ? 0.92 : undefined;
        return new Promise((resolve) => {
            canvas.toBlob(blob => resolve(blob), this.outputMime, quality);
        });
    }
}

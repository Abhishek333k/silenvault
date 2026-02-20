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
        if (['CR2', 'DNG', 'NEF', 'ARW'].includes(this.ext.toUpperCase())) {
            try {
                const thumbBuffer = await window.exifr.thumbnail(this.file);
                if(thumbBuffer) return URL.createObjectURL(new Blob([thumbBuffer], {type: 'image/jpeg'}));
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
        return URL.createObjectURL(this.file);
    }

    async scrub(sourceImageObj) {
        const canvas = document.createElement('canvas');
        canvas.width = sourceImageObj.naturalWidth;
        canvas.height = sourceImageObj.naturalHeight;
        canvas.getContext('2d').drawImage(sourceImageObj, 0, 0);
        
        const quality = (this.outputMime === 'image/jpeg' || this.outputMime === 'image/webp') ? 0.92 : undefined;
        return new Promise((resolve) => canvas.toBlob(blob => resolve(blob), this.outputMime, quality));
    }
}

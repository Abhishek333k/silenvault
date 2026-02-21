import { CanvasProcessor } from './CanvasProcessor.js';

export class WebpProcessor extends CanvasProcessor {
    constructor(file, ext) {
        super(file, ext, 'image/webp');
        this.engineName = 'ExifReader Scout + Canvas Purge';
        this.engineClass = 'text-blue-400 font-mono text-sm';
        this.buttonText = 'Execute Canvas Purge';
    }

    async parse() {
        let exifData = {};

        // 1. Standard scanner fallback
        try {
            const buffer = await this.file.arrayBuffer();
            const standardData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true, iptc: true});
            if (standardData) Object.assign(exifData, standardData);
        } catch(e) {}

        // 2. ExifReader (Pulls smuggled tags ignoring broken WebP headers)
        if (window.ExifReader) {
            try {
                const tags = await window.ExifReader.load(this.file);
                
                for (const [key, tag] of Object.entries(tags)) {
                    if (['Image Width', 'Image Height', 'colorSpace'].includes(key)) continue;
                    
                    let val = tag.description !== undefined ? tag.description : tag.value;
                    if (Array.isArray(val)) val = val.join(', ');

                    if (exifData[key] === undefined) {
                        exifData[key] = val;
                    }
                }
            } catch(e) {
                console.warn("[WebpProcessor] ExifReader failed to parse file.", e);
            }
        } else {
            console.error("[WebpProcessor] window.ExifReader is missing. Check your HTML script tag.");
            const terminalOut = document.getElementById('terminal-out');
            if(terminalOut) terminalOut.innerHTML += `<div class="log-line"><span class="val-high">SYSTEM WARNING: ExifReader missing. Reading may be incomplete.</span></div>`;
        }

        return Object.keys(exifData).length > 0 ? exifData : null;
    }
}

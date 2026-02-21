export class WebpProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.webp';
        this.engineName = 'Native RIFF Splicer';
        this.engineClass = 'text-blue-400 font-mono text-sm';
        this.buttonText = 'Execute RIFF Purge';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        let exifData = {};
        try {
            // ExifReader aggressively scans chunks and ignores lying VP8X flags
            const tags = await window.ExifReader.load(buffer, {includeUnknown: true});
            for (let key in tags) {
                if (key === 'Thumbnail' || key === 'base64') continue;
                exifData[key] = tags[key].description || tags[key].value;
            }
            // Map GPS specifically for our map UI
            if (tags['GPSLatitude'] && tags['GPSLongitude']) {
                exifData.latitude = tags['GPSLatitude'].description;
                exifData.longitude = tags['GPSLongitude'].description;
            }
        } catch(e) { console.warn("ExifReader failed:", e); }
        
        return Object.keys(exifData).length > 0 ? exifData : null;
    }

    async getPreviewUrl() {
        return URL.createObjectURL(this.file);
    }

    async scrub() {
        const buffer = await this.file.arrayBuffer();
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57454250) {
            throw new Error("Invalid WebP format.");
        }

        let offset = 12; 
        let chunksToKeep = [uint8.slice(0, 12)]; 
        const threatChunks = ['EXIF', 'exif', 'XMP ', 'xmp '];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            const chunkId = String.fromCharCode(uint8[offset], uint8[offset + 1], uint8[offset + 2], uint8[offset + 3]);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            if (!threatChunks.includes(chunkId)) {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                // Flip flags to 0 in the master VP8X header so the output is perfectly valid
                if (chunkId === 'VP8X') chunkData[8] &= ~0x0C; 
                chunksToKeep.push(chunkData);
            }
            offset += 8 + paddedSize;
        }

        const totalLength = chunksToKeep.reduce((acc, chunk) => acc + chunk.length, 0);
        const cleanBuffer = new Uint8Array(totalLength);
        let writeOffset = 0;
        
        for (let chunk of chunksToKeep) {
            cleanBuffer.set(chunk, writeOffset);
            writeOffset += chunk.length;
        }

        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

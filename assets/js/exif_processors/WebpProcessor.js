export class WebpProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'WebP RIFF Splicer';
        this.engineClass = 'text-blue-300 font-mono';
        this.buttonText = 'Scrub WebP RIFF';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true});
    }

    async getPreviewUrl() {
        return URL.createObjectURL(this.file);
    }

    async scrub() {
        const buffer = await this.file.arrayBuffer();
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57454250) {
            throw new Error("Invalid WebP format");
        }

        let offset = 12; 
        let chunksToKeep = [uint8.slice(0, 12)];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            const chunkId = view.getUint32(offset, false);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            // Drop EXIF and XMP chunks
            if (chunkId !== 0x45584946 && chunkId !== 0x584D5020) {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // If VP8X header, mathematically zero out the EXIF/XMP presence bits
                if (chunkId === 0x56503858) { 
                    chunkData[8] &= ~0x0C; 
                }
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

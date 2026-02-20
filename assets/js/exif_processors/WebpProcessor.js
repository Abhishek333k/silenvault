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

    async getPreviewUrl() { return URL.createObjectURL(this.file); }

    async scrub() {
        const buffer = await this.file.arrayBuffer();
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        if (view.getUint32(0, false) !== 0x52494646) throw new Error("Invalid WebP");

        let offset = 12; 
        let chunksToKeep = [uint8.slice(0, 12)];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            const chunkId = String.fromCharCode(uint8[offset], uint8[offset + 1], uint8[offset + 2], uint8[offset + 3]);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            if (chunkId !== 'EXIF' && chunkId !== 'XMP ') {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // CRITICAL: Mathematically flip EXIF and XMP bit flags to 0 in the VP8X header
                if (chunkId === 'VP8X') { 
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
        cleanView.setUint32(4, totalLength - 8, true); // Fix master file size

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

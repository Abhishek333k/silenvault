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
            
            // 0x45584946 is 'EXIF', 0x584D5020 is 'XMP '
            if (chunkId === 0x45584946 || chunkId === 0x584D5020) {
                console.log(`[WebpProcessor] Dropped metadata chunk: ${chunkId.toString(16)}`);
            } else {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // CRITICAL FIX: If this is the VP8X header, we MUST mathematically flip the EXIF and XMP flags to 0.
                if (chunkId === 0x56503858) { // 'VP8X'
                    chunkData[8] &= ~0x0C; // Clears Bit 3 (EXIF) and Bit 2 (XMP) safely
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

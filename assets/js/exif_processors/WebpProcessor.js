export class WebpProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'WebP RIFF Splicer';
        this.engineClass = 'text-blue-300 font-mono';
        this.buttonText = 'Scrub WebP RIFF';
    }

    async parse() {
        // Fallback to exifr for reading, but we handle the scrubbing manually
        const buffer = await this.file.arrayBuffer();
        return await exifr.parse(buffer, {tiff: true, exif: true, gps: true});
    }

    async getPreviewUrl() {
        return URL.createObjectURL(this.file);
    }

    async scrub() {
        // RUTHLESS BINARY SCRUBBING FOR WEBP
        const buffer = await this.file.arrayBuffer();
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        // Ensure it's a RIFF file and a WEBP
        if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57454250) {
            throw new Error("Invalid WebP format");
        }

        let offset = 12; // Start after 'RIFF', size, and 'WEBP'
        let chunksToKeep = [];
        
        // Read "RIFF" header into the keep array
        chunksToKeep.push(uint8.slice(0, 12));

        while (offset < buffer.byteLength) {
            const chunkId = view.getUint32(offset, false);
            const chunkSize = view.getUint32(offset + 4, true); // WebP chunk sizes are little-endian
            const paddedSize = chunkSize + (chunkSize % 2); // Padding byte if odd
            
            // 0x45584946 is 'EXIF', 0x584D5020 is 'XMP '
            if (chunkId === 0x45584946 || chunkId === 0x584D5020) {
                console.log(`[WebpProcessor] Dropped metadata chunk: ${chunkId.toString(16)}`);
            } else {
                chunksToKeep.push(uint8.slice(offset, offset + 8 + paddedSize));
            }
            offset += 8 + paddedSize;
        }

        // Reconstruct file
        const totalLength = chunksToKeep.reduce((acc, chunk) => acc + chunk.length, 0);
        const cleanBuffer = new Uint8Array(totalLength);
        let writeOffset = 0;
        for (let chunk of chunksToKeep) {
            cleanBuffer.set(chunk, writeOffset);
            writeOffset += chunk.length;
        }

        // Update main RIFF file size header (totalLength - 8 bytes for RIFF header itself)
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true);

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

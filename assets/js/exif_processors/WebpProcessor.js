export class WebpProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'WebP RIFF Splicer';
        this.engineClass = 'text-blue-400 font-mono text-sm';
        this.buttonText = 'Execute RIFF Purge';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        
        // 1. The Standard Scout
        let exifData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true}) || {};

        // 2. The Rogue Chunk Scout (Finds smuggled data that bypasses VP8X flags)
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        // Ensure it's a valid WebP before scanning
        if (view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
            let offset = 12; // Skip RIFF header
            
            while (offset < buffer.byteLength) {
                if (offset + 8 > buffer.byteLength) break;
                
                // Read the 4-character ASCII chunk ID
                const chunkId = String.fromCharCode(uint8[offset], uint8[offset+1], uint8[offset+2], uint8[offset+3]);
                const chunkSize = view.getUint32(offset + 4, true); // WebP uses Little Endian sizes
                const paddedSize = chunkSize + (chunkSize % 2); // Chunks are always padded to even byte lengths
                
                if (['EXIF', 'exif', 'XMP ', 'xmp '].includes(chunkId)) {
                    if (Object.keys(exifData).length === 0) {
                        // Flag the smuggled payload for the terminal UI
                        exifData['Smuggled_Payload'] = `Hidden ${chunkId} chunk detected ignoring VP8X rules.`;
                        exifData['Threat_Level'] = 'High (Intentional Injection)';
                    }
                }
                offset += 8 + paddedSize;
            }
        }

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
        let chunksToKeep = [uint8.slice(0, 12)]; // Keep the master RIFF header
        const threatChunks = ['EXIF', 'exif', 'XMP ', 'xmp '];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            const chunkId = String.fromCharCode(uint8[offset], uint8[offset + 1], uint8[offset + 2], uint8[offset + 3]);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            if (!threatChunks.includes(chunkId)) {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // CRITICAL: Mathematically flip EXIF (Bit 3) and XMP (Bit 2) flags to 0 in the VP8X header.
                // If we don't do this, strict parsers will declare the newly cleaned file corrupted.
                if (chunkId === 'VP8X') { 
                    chunkData[8] &= ~0x0C; // 0x0C is binary 00001100. The bitwise NOT (~) operator forces them to 0.
                }
                chunksToKeep.push(chunkData);
            } else {
                console.log(`[WebpProcessor] Annihilated threat chunk: ${chunkId}`);
            }
            offset += 8 + paddedSize;
        }

        // Stitch the safe chunks back together
        const totalLength = chunksToKeep.reduce((acc, chunk) => acc + chunk.length, 0);
        const cleanBuffer = new Uint8Array(totalLength);
        let writeOffset = 0;
        
        for (let chunk of chunksToKeep) {
            cleanBuffer.set(chunk, writeOffset);
            writeOffset += chunk.length;
        }

        // Recalculate the master file size for the RIFF container
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

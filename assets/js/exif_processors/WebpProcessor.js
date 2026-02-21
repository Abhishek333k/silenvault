export class WebpProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.webp';
        this.engineName = 'WebP RIFF Splicer';
        this.engineClass = 'text-blue-400 font-mono text-sm';
        this.buttonText = 'Execute RIFF Purge';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        
        // 1. The Standard Scout (Reads compliant metadata)
        let exifData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true}) || {};

        // 2. The Rogue Chunk Scout (Hunts down dirty injections that bypass VP8X rules)
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        // Verify it's a valid WebP RIFF
        if (view.byteLength > 12 && view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
            let offset = 12; // Skip 'RIFF' + Size + 'WEBP'
            
            while (offset < buffer.byteLength) {
                if (offset + 8 > buffer.byteLength) break;
                
                // Read 4-letter chunk ID
                const chunkId = String.fromCharCode(uint8[offset], uint8[offset+1], uint8[offset+2], uint8[offset+3]);
                const chunkSize = view.getUint32(offset + 4, true); // WebP uses Little Endian
                const paddedSize = chunkSize + (chunkSize % 2); // Chunks are even-byte aligned
                
                // If we manually spot an EXIF chunk...
                if (chunkId === 'EXIF' || chunkId === 'exif') {
                    try {
                        // Slice out the exact raw payload
                        const payload = buffer.slice(offset + 8, offset + 8 + chunkSize);
                        
                        // Force-feed it directly into exifr, bypassing WebP container logic
                        const smuggledData = await window.exifr.parse(payload, {tiff: true, exif: true, gps: true}) || {};
                        
                        let recoveredCount = 0;
                        for (let key in smuggledData) {
                            if (exifData[key] === undefined) {
                                exifData[key] = smuggledData[key];
                                recoveredCount++;
                            }
                        }
                        
                        if (recoveredCount > 0) {
                            exifData['Forensic_Alert'] = `Recovered ${recoveredCount} hidden tags from rogue EXIF chunk.`;
                        }
                    } catch (e) {
                        console.warn("[WebpProcessor] Failed to force-parse rogue chunk.", e);
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
        let chunksToKeep = [uint8.slice(0, 12)]; // Keep master RIFF header
        const threatChunks = ['EXIF', 'exif', 'XMP ', 'xmp '];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            const chunkId = String.fromCharCode(uint8[offset], uint8[offset + 1], uint8[offset + 2], uint8[offset + 3]);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            if (!threatChunks.includes(chunkId)) {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // CRITICAL: Mathematically flip EXIF and XMP flags to 0 in the master VP8X header
                if (chunkId === 'VP8X') { 
                    chunkData[8] &= ~0x0C; 
                }
                chunksToKeep.push(chunkData);
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

        // Fix master file size
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

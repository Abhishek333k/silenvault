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
        
        // 1. Standard Parse (Relies on proper VP8X flags)
        let exifData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true}) || {};

        // 2. The Rogue Chunk "Force-Feed" Protocol
        // This detects data that was "dirty injected" and forces the parser to read it anyway.
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        // Ensure it's a valid WebP RIFF
        if (view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
            let offset = 12; // Skip 'RIFF' + Size + 'WEBP'
            
            while (offset < buffer.byteLength) {
                if (offset + 8 > buffer.byteLength) break;
                
                // Read 4-letter chunk ID
                const chunkId = String.fromCharCode(uint8[offset], uint8[offset+1], uint8[offset+2], uint8[offset+3]);
                const chunkSize = view.getUint32(offset + 4, true); // WebP uses Little Endian for chunk size
                const paddedSize = chunkSize + (chunkSize % 2); // Chunks must be even-byte aligned
                
                // If we find an EXIF chunk manually
                if (chunkId === 'EXIF' || chunkId === 'exif') {
                    try {
                        // Slice out the exact bytes of the EXIF payload
                        const exifPayload = buffer.slice(offset + 8, offset + 8 + chunkSize);
                        
                        // Force-feed just the payload into the parser, bypassing WebP container rules
                        const smuggledData = await window.exifr.parse(exifPayload, {tiff: true, exif: true, gps: true}) || {};
                        
                        // Merge the recovered data into our main output
                        let recoveredCount = 0;
                        for (let key in smuggledData) {
                            if (exifData[key] === undefined) {
                                exifData[key] = smuggledData[key];
                                recoveredCount++;
                            }
                        }
                        
                        // If we recovered GPS or hidden data, flag it in the terminal
                        if (recoveredCount > 0) {
                            exifData['Forensic_Flag'] = `Recovered ${recoveredCount} hidden tags from rogue EXIF chunk.`;
                        }
                        
                    } catch (e) {
                        console.warn("[WebpProcessor] Failed to force-parse rogue EXIF chunk.", e);
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
        
        // Target variations of EXIF and XMP chunk names
        const threatChunks = ['EXIF', 'exif', 'XMP ', 'xmp '];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            const chunkId = String.fromCharCode(uint8[offset], uint8[offset + 1], uint8[offset + 2], uint8[offset + 3]);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            if (!threatChunks.includes(chunkId)) {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // CRITICAL: Mathematically flip EXIF and XMP flags to 0 in the VP8X header
                if (chunkId === 'VP8X') { 
                    chunkData[8] &= ~0x0C; // Forces Bits 3 (EXIF) and 2 (XMP) to 0
                }
                chunksToKeep.push(chunkData);
            }
            offset += 8 + paddedSize;
        }

        // Stitch the safe chunks back together perfectly
        const totalLength = chunksToKeep.reduce((acc, chunk) => acc + chunk.length, 0);
        const cleanBuffer = new Uint8Array(totalLength);
        let writeOffset = 0;
        
        for (let chunk of chunksToKeep) {
            cleanBuffer.set(chunk, writeOffset);
            writeOffset += chunk.length;
        }

        // Recalculate master file size
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

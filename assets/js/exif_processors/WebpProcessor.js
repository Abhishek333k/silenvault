// Import MattiasW's ExifReader natively as an ES6 Module
import ExifReader from 'https://esm.sh/exifreader';

export class WebpProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.webp';
        this.engineName = 'ExifReader Scout + Native Splicer';
        this.engineClass = 'text-blue-400 font-mono text-sm';
        this.buttonText = 'Execute RIFF Purge';
    }

    async parse() {
        let exifData = {};

        try {
            // ExifReader is extremely aggressive. It reads the raw file object directly
            // and ignores corrupted or lying VP8X master headers.
            const tags = await ExifReader.load(this.file);
            
            for (const [key, tag] of Object.entries(tags)) {
                // Skip base structural properties that ExifReader auto-generates
                if (['Image Width', 'Image Height', 'colorSpace'].includes(key)) continue;
                
                // ExifReader provides a human-readable 'description' or raw 'value'
                let val = tag.description !== undefined ? tag.description : tag.value;
                if (Array.isArray(val)) val = val.join(', ');

                exifData[key] = val;
            }
            
            // Log to console for debugging so we know ExifReader caught it
            console.log("[WebpProcessor] ExifReader successfully parsed data:", exifData);

        } catch (e) {
            console.error("[WebpProcessor] ExifReader failed to parse file.", e);
        }

        return Object.keys(exifData).length > 0 ? exifData : null;
    }

    async getPreviewUrl() {
        return URL.createObjectURL(this.file);
    }

    async scrub() {
        const buffer = await this.file.arrayBuffer();
        const terminalOut = document.getElementById('terminal-out');
        
        if(terminalOut) {
            terminalOut.innerHTML += `<div class="log-line"><span class="val-sys">> INITIATING NATIVE RIFF SPLICER (THE MISSILE)...</span></div>`;
            terminalOut.scrollTop = terminalOut.scrollHeight;
        }

        // THE MISSILE: We physically cut the EXIF chunks out of the WebP RIFF container.
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        
        if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57454250) {
            throw new Error("Invalid WebP format.");
        }

        let offset = 12; 
        let chunksToKeep = [uint8.slice(0, 12)]; // Preserve the master RIFF header
        const threatChunks = ['EXIF', 'exif', 'XMP ', 'xmp '];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            // Read the 4-character chunk ID
            const chunkId = String.fromCharCode(uint8[offset], uint8[offset + 1], uint8[offset + 2], uint8[offset + 3]);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            // If the chunk is NOT a threat chunk, we keep it
            if (!threatChunks.includes(chunkId)) {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // CRITICAL FIX: We MUST mathematically flip the EXIF and XMP flags to 0 in the master VP8X header.
                // This prevents the file from becoming corrupted after we delete the payload.
                if (chunkId === 'VP8X') { 
                    chunkData[8] &= ~0x0C; // Flips bit 2 and 3 to 0 using bitwise NOT
                }
                chunksToKeep.push(chunkData);
            } else {
                console.log(`[WebpProcessor] Target acquired and destroyed: ${chunkId} chunk.`);
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

        // Fix the master RIFF container file size header so the file opens flawlessly
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

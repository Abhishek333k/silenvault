export class WebpProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.webp';
        this.engineName = 'ExifReader Scout + Native Splicer';
        this.engineClass = 'text-blue-400 font-mono text-sm';
        this.buttonText = 'Execute RIFF Purge';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        let exifData = {};

        // --- DEBUGGING UX: Alert if the library didn't load due to a typo ---
        if (!window.ExifReader) {
            console.error("[WebpProcessor] CRITICAL: window.ExifReader is undefined. Check your HTML script tag for typos.");
            const terminalOut = document.getElementById('terminal-out');
            if (terminalOut) {
                terminalOut.innerHTML += `<div class="log-line"><span class="val-high">SYSTEM WARNING: ExifReader missing from HTML. Using weak fallback.</span></div>`;
            }
        }

        // 1. PASS ONE: Global ExifReader (MattiasW's Engine)
        try {
            if (window.ExifReader) {
                // ExifReader parses the ArrayBuffer natively
                const tags = window.ExifReader.load(buffer);
                for (const [key, tag] of Object.entries(tags)) {
                    // Ignore auto-generated structural properties
                    if (['Image Width', 'Image Height', 'colorSpace'].includes(key)) continue;
                    let val = tag.description !== undefined ? tag.description : tag.value;
                    if (Array.isArray(val)) val = val.join(', ');
                    exifData[key] = val;
                }
            }
        } catch(e) { 
            console.warn("[WebpProcessor] Global ExifReader parse failed.", e); 
        }

        // 2. PASS TWO: The Rogue Chunk Slicer
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);

        if (view.byteLength > 12 && view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
            let offset = 12; // Skip 'RIFF' + Size + 'WEBP'
            
            while (offset < buffer.byteLength) {
                if (offset + 8 > buffer.byteLength) break;
                
                const chunkId = String.fromCharCode(uint8[offset], uint8[offset+1], uint8[offset+2], uint8[offset+3]);
                const chunkSize = view.getUint32(offset + 4, true); 
                const paddedSize = chunkSize + (chunkSize % 2); 

                // Target Acquired
                if (chunkId === 'EXIF' || chunkId === 'exif') {
                    try {
                        const payload = buffer.slice(offset + 8, offset + 8 + chunkSize);
                        const payload8 = new Uint8Array(payload);

                        // Find pure TIFF offset ('II' for Intel, 'MM' for Motorola)
                        // This strips away the "Exif\x00\x00" garbage padding that chokes parsers
                        let tiffOffset = 0;
                        for(let i = 0; i < payload8.length - 1; i++) {
                            if ((payload8[i] === 0x49 && payload8[i+1] === 0x49) || (payload8[i] === 0x4D && payload8[i+1] === 0x4D)) {
                                tiffOffset = i;
                                break;
                            }
                        }
                        
                        const cleanPayload = payload.slice(tiffOffset);

                        if (window.ExifReader) {
                            const smuggledTags = window.ExifReader.load(cleanPayload);
                            let recovered = 0;
                            
                            for (const [key, tag] of Object.entries(smuggledTags)) {
                                if (['Image Width', 'Image Height', 'colorSpace'].includes(key)) continue;
                                if (!exifData[key]) {
                                    let val = tag.description !== undefined ? tag.description : tag.value;
                                    if (Array.isArray(val)) val = val.join(', ');
                                    exifData[key] = val;
                                    recovered++;
                                }
                            }
                            if(recovered > 0) {
                                exifData['FORENSIC_ALERT'] = `Recovered ${recovered} hidden tags from rogue EXIF chunk.`;
                            }
                        }
                    } catch(e) { 
                        console.warn("[WebpProcessor] Rogue chunk force-feed failed.", e); 
                    }
                }
                offset += 8 + paddedSize;
            }
        }

        // 3. PASS THREE: Exifr Fallback (if ExifReader fails completely)
        if (Object.keys(exifData).length === 0) {
            try {
                const standardData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true});
                if (standardData) Object.assign(exifData, standardData);
            } catch(e) {}
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
                
                // CRITICAL FIX: Mathematically flip EXIF and XMP flags to 0 in the master VP8X header.
                if (chunkId === 'VP8X') { 
                    chunkData[8] &= ~0x0C; 
                }
                chunksToKeep.push(chunkData);
            } else {
                console.log(`[WebpProcessor] Target acquired and destroyed: ${chunkId}`);
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

        // Recalculate master file size
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

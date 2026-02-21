export class WebpProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.webp';
        this.engineName = 'Native Hex Scout & RIFF Splicer';
        this.engineClass = 'text-blue-400 font-bold font-mono text-sm';
        this.buttonText = 'Execute RIFF Purge';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        let exifData = {};

        // 1. Let the standard engine try first
        try {
            const standardData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true});
            if (standardData) Object.assign(exifData, standardData);
        } catch(e) {}

        // 2. THE NATIVE HEX SCOUT
        // This physically walks the WebP binary to hunt for injected chunks that standard parsers miss.
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);

        // Verify it's a valid WebP RIFF container
        if (view.byteLength > 12 && view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
            let offset = 12; // Skip master header
            
            while (offset < buffer.byteLength) {
                if (offset + 8 > buffer.byteLength) break;
                
                const chunkId = String.fromCharCode(uint8[offset], uint8[offset+1], uint8[offset+2], uint8[offset+3]);
                const chunkSize = view.getUint32(offset + 4, true); 
                const paddedSize = chunkSize + (chunkSize % 2); 

                // If we find an EXIF chunk manually...
                if (chunkId === 'EXIF' || chunkId === 'exif') {
                    try {
                        const payload = buffer.slice(offset + 8, offset + 8 + chunkSize);
                        const payload8 = new Uint8Array(payload);

                        // CRITICAL HACK: Find the exact start of the pure TIFF block ('II' or 'MM').
                        // This strips away the "Exif\x00\x00" garbage padding that chokes standard readers.
                        let tiffOffset = -1;
                        for(let i = 0; i < payload8.length - 1; i++) {
                            if ((payload8[i] === 0x49 && payload8[i+1] === 0x49) || (payload8[i] === 0x4D && payload8[i+1] === 0x4D)) {
                                tiffOffset = i;
                                break;
                            }
                        }
                        
                        if (tiffOffset !== -1) {
                            // Slice out the pure TIFF block
                            const cleanPayload = payload.slice(tiffOffset);

                            // Force-feed the pure block directly into exifr
                            const smuggledData = await window.exifr.parse(cleanPayload, {tiff: true, exif: true, gps: true});
                            
                            if (smuggledData) {
                                let recovered = 0;
                                for (const [key, val] of Object.entries(smuggledData)) {
                                    if (exifData[key] === undefined) {
                                        exifData[key] = val;
                                        recovered++;
                                    }
                                }
                                if(recovered > 0) {
                                    exifData['FORENSIC_ALERT'] = `Recovered ${recovered} hidden tags from smuggled EXIF chunk.`;
                                }
                            }
                        }
                    } catch(e) { 
                        console.warn("[WebpProcessor] Native Hex Scout failed to parse slice.", e); 
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
        const terminalOut = document.getElementById('terminal-out');
        
        if(terminalOut) {
            terminalOut.innerHTML += `<div class="log-line"><span class="val-sys">> INITIATING NATIVE RIFF SPLICER...</span></div>`;
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
                
                // CRITICAL REPAIR: Mathematically flip EXIF and XMP flags to 0 in the master VP8X header.
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

        // Recalculate master file size
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

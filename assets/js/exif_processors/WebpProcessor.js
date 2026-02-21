export class WebpProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.webp';
        this.engineName = 'ExifReader Scout + Native Splicer';
        this.engineClass = 'text-blue-400 font-mono text-sm';
        this.buttonText = 'Execute RIFF Purge';
    }

    // Dynamically injects MattiasW's ExifReader only when needed
    async loadExifReader() {
        if (window.ExifReader) return;
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/exifreader@latest/dist/exif-reader.min.js';
            script.onload = () => {
                console.log("[WebpProcessor] MattiasW ExifReader deployed.");
                resolve();
            };
            script.onerror = () => reject(new Error("Failed to load ExifReader"));
            document.head.appendChild(script);
        });
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        let exifData = {};

        try {
            // Load the aggressive ExifReader
            await this.loadExifReader();
            
            // ExifReader parses the ArrayBuffer directly. 
            // We don't use 'expanded: true' because the flat object maps perfectly to our Terminal UI
            const tags = window.ExifReader.load(buffer);
            
            // Map the parsed tags to our standard format
            for (const [key, tag] of Object.entries(tags)) {
                // Skip basic structural properties that ExifReader adds automatically
                if (['Image Width', 'Image Height'].includes(key)) continue;
                
                // ExifReader provides both raw 'value' and human-readable 'description'. We prioritize description.
                let val = tag.description !== undefined ? tag.description : tag.value;
                if (Array.isArray(val)) val = val.join(', '); // Handle GPS array formats

                exifData[key] = val;
            }
            
        } catch (e) {
            console.warn("[WebpProcessor] ExifReader failed, falling back to exifr.", e);
            // Absolute failsafe fallback just in case
            try {
                const standardData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true});
                if (standardData) Object.assign(exifData, standardData);
            } catch(err) {}
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
        let chunksToKeep = [uint8.slice(0, 12)]; 
        const threatChunks = ['EXIF', 'exif', 'XMP ', 'xmp '];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;

            const chunkId = String.fromCharCode(uint8[offset], uint8[offset + 1], uint8[offset + 2], uint8[offset + 3]);
            const chunkSize = view.getUint32(offset + 4, true); 
            const paddedSize = chunkSize + (chunkSize % 2); 
            
            if (!threatChunks.includes(chunkId)) {
                let chunkData = uint8.slice(offset, offset + 8 + paddedSize);
                
                // CRITICAL FIX: We MUST mathematically flip the EXIF and XMP flags to 0 in the master VP8X header.
                // This prevents the file from becoming corrupted after we delete the payload.
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

        // Fix the master RIFF container file size header
        const cleanView = new DataView(cleanBuffer.buffer);
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

export class WebpProcessor {
    constructor(file, ext) {
        this.file = file;
        this.ext = ext || '.webp';
        this.engineName = 'WASM Scout + Native Splicer';
        this.engineClass = 'text-indigo-400 font-mono text-sm';
        this.buttonText = 'Execute WASM/RIFF Purge';
    }

    // THE WASM SCOUT: Downloads the 5MB payload secretly during the "Scanning..." phase
    async loadWasm() {
        if (window.exiv2Api) return;
        try {
            const module = await import('../../wasm/exiv2.esm.js');
            const exiv2Factory = module.default || module;
            window.exiv2Api = await exiv2Factory({
                locateFile: (path) => {
                    if (path.endsWith('.wasm')) return '../assets/wasm/exiv2.esm.wasm';
                    return path;
                }
            });
            console.log("[WebpProcessor] WASM Scout successfully deployed behind enemy lines.");
        } catch (err) {
            console.warn("WASM Engine failed to load. Will rely on standard JS parsing.");
        }
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        let exifData = {};

        // 1. The Standard JS Scout (Catches normal, compliant metadata instantly)
        try {
            const standardData = await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true});
            if (standardData) Object.assign(exifData, standardData);
        } catch(e) {}

        // 2. THE WASM SCOUT (Boots C++ to hunt down smuggled/dirty injections)
        await this.loadWasm();
        
        if (window.exiv2Api) {
            try {
                const uint8Array = new Uint8Array(buffer);
                const img = new window.exiv2Api.Image(uint8Array);
                
                // Exiv2 C++ Extraction
                const wasmExif = img.exif();
                let recoveredCount = 0;
                
                if (wasmExif) {
                    for (let key in wasmExif) {
                        // Exiv2 returns ugly C++ keys like "Exif.Photo.DateTimeOriginal". We clean them up.
                        const simpleKey = key.split('.').pop();
                        
                        // If standard JS missed it, but C++ found it, we expose it!
                        if (exifData[simpleKey] === undefined) {
                            exifData[simpleKey] = wasmExif[key];
                            recoveredCount++;
                        }
                    }

                    // Explicitly hunt for smuggled GPS coordinates
                    if (wasmExif['Exif.GPSInfo.GPSLatitude'] || wasmExif['Exif.Image.GPSTag']) {
                        exifData['GPSLatitude'] = wasmExif['Exif.GPSInfo.GPSLatitude'] || "SMUGGLED_LAT_FOUND";
                        exifData['GPSLongitude'] = wasmExif['Exif.GPSInfo.GPSLongitude'] || "SMUGGLED_LNG_FOUND";
                        recoveredCount++;
                    }
                }
                
                if (recoveredCount > 0) {
                    exifData['WASM_FORENSIC_ALERT'] = `Recovered ${recoveredCount} hidden tracking tags using Deep C++ Scan.`;
                }

                img.delete(); // Free RAM
            } catch (e) {
                console.warn("[WebpProcessor] WASM read failed.", e);
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
            terminalOut.innerHTML += `<div class="log-line"><span class="val-sys">> INITIATING NATIVE RIFF SPLICER (THE MISSILE)...</span></div>`;
            terminalOut.scrollTop = terminalOut.scrollHeight;
        }

        // THE MISSILE: We use our native JS RIFF Splicer instead of WASM to delete it, 
        // because we MUST mathematically fix the WebP VP8X bit-flags, which C++ Exiv2 sometimes fails to do.
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
                
                // CRITICAL MISSILE PAYLOAD: Mathematically flip EXIF and XMP flags to 0 in the master VP8X header.
                // This ensures the container structurally validates after we nuke the data.
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
        cleanView.setUint32(4, totalLength - 8, true); 

        return new Blob([cleanBuffer], { type: 'image/webp' });
    }
}

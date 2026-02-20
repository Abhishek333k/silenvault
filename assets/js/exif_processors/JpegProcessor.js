export class JpegProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'JPEG APP1 Splicer';
        this.engineClass = 'text-blue-300 font-mono';
        this.buttonText = 'Scrub JPEG Binary';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, iptc: true, xmp: true});
    }

    async getPreviewUrl() { return URL.createObjectURL(this.file); }

    async scrub() {
        const buffer = await this.file.arrayBuffer();
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);

        if (view.getUint16(0, false) !== 0xFFD8) throw new Error("Invalid JPEG format");

        let offset = 2; 
        let chunksToKeep = [uint8.slice(0, 2)]; 

        while (offset < buffer.byteLength) {
            // Safely skip arbitrary 0xFF padding bytes injected by cameras
            while (offset < buffer.byteLength && uint8[offset] === 0xFF && uint8[offset + 1] === 0xFF) offset++;
            if (offset >= buffer.byteLength - 2) break;

            const marker = view.getUint16(offset, false);
            
            if (marker === 0xFFDA) { // Start of Image Scan (Pixels)
                chunksToKeep.push(uint8.slice(offset));
                break;
            }

            const segmentLength = view.getUint16(offset + 2, false) + 2; 

            // 0xFFE1 is EXIF/XMP. 0xFFED is IPTC. We drop them.
            if (marker !== 0xFFE1 && marker !== 0xFFED) {
                chunksToKeep.push(uint8.slice(offset, offset + segmentLength));
            }
            offset += segmentLength;
        }

        const totalLength = chunksToKeep.reduce((acc, chunk) => acc + chunk.length, 0);
        const cleanBuffer = new Uint8Array(totalLength);
        let writeOffset = 0;
        for (let chunk of chunksToKeep) {
            cleanBuffer.set(chunk, writeOffset);
            writeOffset += chunk.length;
        }

        return new Blob([cleanBuffer], { type: 'image/jpeg' });
    }
}

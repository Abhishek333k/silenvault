export class JpegProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'JPEG APP1 Splicer';
        this.engineClass = 'text-blue-300 font-mono';
        this.buttonText = 'Scrub JPEG Binary';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await exifr.parse(buffer, {tiff: true, exif: true, gps: true, iptc: true, xmp: true});
    }

    async getPreviewUrl() {
        return URL.createObjectURL(this.file);
    }

    async scrub() {
        const buffer = await this.file.arrayBuffer();
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);

        // Verify JPEG Magic Number (0xFFD8)
        if (view.getUint16(0, false) !== 0xFFD8) {
            throw new Error("Invalid JPEG format");
        }

        let offset = 2; // Start after 0xFFD8
        let chunksToKeep = [];
        chunksToKeep.push(uint8.slice(0, 2)); // Keep SOI marker

        while (offset < buffer.byteLength) {
            // If we hit the Start of Scan (0xFFDA), the rest of the file is image data. Keep it all.
            if (view.getUint16(offset, false) === 0xFFDA) {
                chunksToKeep.push(uint8.slice(offset));
                break;
            }

            const marker = view.getUint16(offset, false);
            const segmentLength = view.getUint16(offset + 2, false) + 2; // Length includes the 2 bytes for the length itself

            // 0xFFE1 is APP1 (EXIF/XMP), 0xFFE2 is APP2 (ICC Profile), 0xFFED is APP13 (IPTC)
            // We surgically remove APP1 and APP13 to strip metadata, but usually keep APP2 so colors don't wash out.
            if (marker === 0xFFE1 || marker === 0xFFED) {
                console.log(`[JpegProcessor] Discarded metadata segment: ${marker.toString(16)}`);
            } else {
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

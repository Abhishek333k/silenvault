export class PngProcessor {
    constructor(file) {
        this.file = file;
        this.engineName = 'PNG Chunk Splicer';
        this.engineClass = 'text-blue-300 font-mono';
        this.buttonText = 'Scrub PNG Chunks';
    }

    async parse() {
        const buffer = await this.file.arrayBuffer();
        return await window.exifr.parse(buffer, {tiff: true, exif: true, gps: true, xmp: true});
    }

    async getPreviewUrl() { return URL.createObjectURL(this.file); }

    async scrub() {
        const buffer = await this.file.arrayBuffer();
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);

        let offset = 8;
        let chunksToKeep = [uint8.slice(0, 8)];
        const threatChunks = ['eXIf', 'tEXt', 'zTXt', 'iTXt'];

        while (offset < buffer.byteLength) {
            if (offset + 8 > buffer.byteLength) break;
            const dataLength = view.getUint32(offset, false);
            
            const chunkType = String.fromCharCode(uint8[offset + 4], uint8[offset + 5], uint8[offset + 6], uint8[offset + 7]);
            const totalChunkLength = 4 + 4 + dataLength + 4; 

            if (!threatChunks.includes(chunkType)) {
                chunksToKeep.push(uint8.slice(offset, offset + totalChunkLength));
            }

            if (chunkType === 'IEND') break; 
            offset += totalChunkLength;
        }

        const totalLength = chunksToKeep.reduce((acc, chunk) => acc + chunk.length, 0);
        const cleanBuffer = new Uint8Array(totalLength);
        let writeOffset = 0;
        for (let chunk of chunksToKeep) {
            cleanBuffer.set(chunk, writeOffset);
            writeOffset += chunk.length;
        }

        return new Blob([cleanBuffer], { type: 'image/png' });
    }
}

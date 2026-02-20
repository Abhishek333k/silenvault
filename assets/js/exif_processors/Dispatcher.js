import { WebpProcessor } from './WebpProcessor.js';
import { JpegProcessor } from './JpegProcessor.js';
import { PngProcessor } from './PngProcessor.js';
import { RawProcessor } from './RawProcessor.js';

export class ProcessorFactory {
    static create(file, ext) {
        const extension = ext.toUpperCase();
        
        switch(extension) {
            case 'WEBP':
                return new WebpProcessor(file);
            case 'PNG':
                return new PngProcessor(file);
            case 'DNG':
            case 'CR2':
            case 'NEF':
            case 'ARW':
                return new RawProcessor(file);
            case 'JPG':
            case 'JPEG':
            case 'JFIF':
                return new JpegProcessor(file);
            default:
                console.warn(`No dedicated processor for ${extension}. Falling back to JPEG Splicer.`);
                return new JpegProcessor(file); 
        }
    }
}

import { WebpProcessor } from './WebpProcessor.js';
import { JpegProcessor } from './JpegProcessor.js';
import { PngProcessor } from './PngProcessor.js';
import { RawProcessor } from './RawProcessor.js';
import { CanvasProcessor } from './CanvasProcessor.js';

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
                console.warn(`No dedicated binary processor for ${extension}. Using safe Canvas fallback.`);
                return new CanvasProcessor(file, ext, 'image/jpeg'); 
        }
    }
}

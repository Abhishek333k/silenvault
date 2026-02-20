import { WebpProcessor } from './WebpProcessor.js';
import { JpegProcessor } from './JpegProcessor.js';
import { PngProcessor } from './PngProcessor.js';
import { RawProcessor } from './RawProcessor.js';
import { CanvasProcessor } from './CanvasProcessor.js';

export class ProcessorFactory {
    static create(file, ext, isAdvancedMode = false) {
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
                return isAdvancedMode ? new RawProcessor(file) : new CanvasProcessor(file, extension, 'image/jpeg');
            case 'JPG': 
            case 'JPEG': 
            case 'JFIF': 
                return new JpegProcessor(file);
            default:
                console.warn(`No dedicated processor for ${extension}. Using generic Canvas fallback.`);
                return new CanvasProcessor(file, extension, 'image/jpeg'); 
        }
    }
}

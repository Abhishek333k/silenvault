import { WebpProcessor } from './WebpProcessor.js';
// Import others as you create them:
// import { JpegProcessor } from './JpegProcessor.js';
// import { RawProcessor } from './RawProcessor.js';

export class ProcessorFactory {
    static create(file, ext) {
        const extension = ext.toUpperCase();
        
        switch(extension) {
            case 'WEBP':
                return new WebpProcessor(file);
            
            case 'PNG':
                return new PngProcessor(file);
                /* Uncomment as you build them
            case 'DNG':
            case 'CR2':
            case 'NEF':
                return new RawProcessor(file);
            */
            default:
                // Fallback to a basic CanvasProcessor until you build JpegProcessor
                console.warn(`No dedicated processor for ${extension}. Using generic.`);
                // Return generic processor here
                return null; 
        }
    }
}

import { Point } from '@nightshifts.inc/geometry';
import { BitmapEditor } from './BitmapEditor';

export interface Pixel {
    color: string;
}

export class PixelController {
    bitMap: Map<number, Pixel> = new Map();
    private bitmapEditor: BitmapEditor;

    constructor(controllers: BitmapEditor) {
        this.bitmapEditor = controllers;
    }

    addPixel(position: Point, pixel: Pixel) {
        const index = this.getPixelIndex(position);

        this.bitMap.set(index, pixel);
    }
    
    removePixel(position: Point): void {
        const x = Math.floor(position.x / this.bitmapEditor.config.pixelSize);
        const y = Math.floor(position.y / this.bitmapEditor.config.pixelSize);
        const xDim = this.bitmapEditor.config.canvasDimensions.x / this.bitmapEditor.config.pixelSize;
        const pixelIndex = y * xDim + x;

        if (this.bitMap.get(pixelIndex)) {
            this.bitMap.delete(pixelIndex);
        }
    }


    getPixelPosition(pixelIndex: number): Point {
        const canvasDimensions = this.bitmapEditor.config.canvasDimensions;
        const pixelSize = this.bitmapEditor.config.pixelSize;
        const xDim = canvasDimensions.x / pixelSize;

        const x = pixelIndex % xDim;
        const y = Math.floor(pixelIndex / xDim);
        
        return new Point(x * pixelSize, y * pixelSize);
    }

    private getPixelIndex(position: Point): number {
        const canvasDimensions = this.bitmapEditor.config.canvasDimensions;
        const pixelSize = this.bitmapEditor.config.pixelSize;
        const xPixels = canvasDimensions.x / pixelSize;

        const xIndex = Math.floor(position.x / pixelSize);
        const yIndex = Math.floor(position.y / pixelSize);

        return yIndex * xPixels + xIndex;
    }
}
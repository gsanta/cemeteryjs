import { ControllerFacade } from '../ControllerFacade';
import { BitmapEditor } from './BitmapEditor';
import { Point } from '@nightshifts.inc/geometry';

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

    getPixelPosition(pixelIndex: number): Point {
        const canvasDimensions = this.bitmapEditor.config.canvasDimensions;
        const pixelSize = this.bitmapEditor.config.pixelSize;
        const xDim = canvasDimensions.x / pixelSize;
        const yDim = canvasDimensions.y / pixelSize;

        const x = pixelIndex % xDim;
        const y = Math.floor(pixelIndex / yDim);
        
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
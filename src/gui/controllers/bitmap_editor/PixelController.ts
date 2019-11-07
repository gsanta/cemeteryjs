import { Point } from '@nightshifts.inc/geometry';
import { Rectangle } from '../../models/bitmap_editor/Rectangle';
import { BitmapEditor } from './BitmapEditor';

export interface Pixel {
    type: string;
    index: number;
}

export class PixelController {
    bitMap: Map<number, Pixel> = new Map();
    pixels: Pixel[] = [];
    private bitmapEditor: BitmapEditor;

    constructor(controllers: BitmapEditor) {
        this.bitmapEditor = controllers;
    }

    addPixel(position: Point, type: string) {
        const index = this.getPixelIndex(position);

        const pixel: Pixel = {
            type,
            index
        }
        this.bitMap.set(index, pixel);
        this.pixels.push(pixel);
    }

    removePixel(pixelIndex: number) {
        const pixel = this.bitMap.get(pixelIndex);
        if (pixel) {
            this.bitMap.delete(pixelIndex);
            this.pixels.splice(this.pixels.indexOf(pixel), 1);
        }
    }
    
    removePixelAtPosition(position: Point): void {
        const x = Math.floor(position.x / this.bitmapEditor.config.pixelSize);
        const y = Math.floor(position.y / this.bitmapEditor.config.pixelSize);
        const xDim = this.bitmapEditor.config.canvasDimensions.x / this.bitmapEditor.config.pixelSize;
        const pixelIndex = y * xDim + x;

        const pixel = this.bitMap.get(pixelIndex);
        if (pixel) {
            this.bitMap.delete(pixelIndex);
            this.pixels.splice(this.pixels.indexOf(pixel), 1);
        }
    }

    clear(): void {
        this.bitMap = new Map();
        this.pixels = [];
    }

    getPixelPosition(pixelIndex: number): Point {
        const canvasDimensions = this.bitmapEditor.config.canvasDimensions;
        const pixelSize = this.bitmapEditor.config.pixelSize;
        const xDim = canvasDimensions.x / pixelSize;

        const x = pixelIndex % xDim;
        const y = Math.floor(pixelIndex / xDim);
        
        return new Point(x, y);
    }

    getAbsolutePosition(pixelIndex: number): Point {
        const pixelPos = this.getPixelPosition(pixelIndex);
        const pixelSize = this.bitmapEditor.config.pixelSize;
        return new Point(pixelPos.x * pixelSize, pixelPos.y * pixelSize)
    }

    getPixelsInside(rectangle: Rectangle): Pixel[] {
        const pixelSize = this.bitmapEditor.config.pixelSize;

        return this.pixels.filter(pixel => {
            const pixelPosition = this.getAbsolutePosition(pixel.index);

            return pixelPosition.x > rectangle.topLeft.x &&
                pixelPosition.y > rectangle.topLeft.y &&
                pixelPosition.x + pixelSize < rectangle.bottomRight.x &&
                pixelPosition.y + pixelSize < rectangle.bottomRight.y
        });
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
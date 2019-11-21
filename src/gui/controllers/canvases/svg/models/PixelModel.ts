import { Point } from '@nightshifts.inc/geometry';
import { Rectangle } from './Rectangle';
import { SvgConfig } from './SvgConfig';
import { last } from '../../../../../model/utils/Functions';

export interface Pixel {
    type: string;
    index: number;
    isPreview: boolean;
    layer: number;
}

export enum Layers {
    PREVIEW = -1,
    ROOM = 0,
    SUBAREA = 1,
    DEFAULT = 2
}

export function getLayerForType(type: string) {
    switch(type) {
        case 'room':
            return Layers.ROOM;
        case '_subarea':
            return Layers.SUBAREA;
        default:
            return Layers.DEFAULT;
    }
}

export class PixelModel {
    bitMap: Map<number, Pixel[]> = new Map();
    pixels: Pixel[] = [];
    indexes: number[] = [];
    private bitmapConfig: SvgConfig;

    constructor(bitmapConfig: SvgConfig) {
        this.bitmapConfig = bitmapConfig;
    }

    addPixel(coordinate: Point, type: string, isPreview: boolean, layer: number) {
        const index = this.getIndexAtCoordinate(coordinate);

        if (this.bitMap.has(index)) {
            // this.removePixelFromMapAtLayer(index, layer);
        }
        
        const pixel: Pixel = {
            type,
            index,
            isPreview,
            layer
        }

        this.addPixelToMap(index, pixel);
        this.pixels.push(pixel);
    }

    commitPreviews() {
        this.pixels
            .filter(pixel => pixel.isPreview)
            .forEach(pixel => {
                pixel.isPreview = false;
                pixel.layer = getLayerForType(pixel.type);

                this.bitMap.get(pixel.index).sort(this.sortByLayer)
            });
    }
    
    removePreviews() {
        const previews = this.pixels.filter(pixel => pixel.isPreview);
    
        previews.forEach(preview => this.removePixelFromMapAtLayer(preview.index, preview.layer));
        this.pixels = this.pixels.filter(pixel => !pixel.isPreview);
    }

    removePixelFromMapAtLayer(pixelIndex: number, layer: number) {
        const list = (this.bitMap.get(pixelIndex) || []);
        const pixel = list.find(pixel => pixel.layer === layer);
        if (pixel) {
            list.splice(list.indexOf(pixel), 1);
            if (list.length === 0) {
                this.bitMap.delete(pixelIndex);
            }
            this.pixels.splice(this.pixels.indexOf(pixel), 1);
        }
    }

    removeTopPixel(pixelIndex: number) {
        const list = (this.bitMap.get(pixelIndex) || []);
        if (list.length > 0) {
            const lastItem = last(list);

            list.splice(list.indexOf(lastItem), 1);
            this.pixels.splice(this.pixels.indexOf(lastItem), 1);
        }
    }

    clear(): void {
        this.bitMap = new Map();
        this.pixels = [];
    }

    getPixelPosition(pixelIndex: number): Point {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xDim = canvasDimensions.x / pixelSize;

        const x = pixelIndex % xDim;
        const y = Math.floor(pixelIndex / xDim);
        
        return new Point(x, y);
    }

    getPixelIndexesInside(rectangle: Rectangle): number[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const indexes: number[] = [];

        this.bitMap.forEach((pixels, index) => {
                const pixelPosition = this.getPixelPosition(index).mul(pixelSize);

                if (pixelPosition.x > rectangle.topLeft.x &&
                    pixelPosition.y > rectangle.topLeft.y &&
                    pixelPosition.x + pixelSize < rectangle.bottomRight.x &&
                    pixelPosition.y + pixelSize < rectangle.bottomRight.y
                ) {
                    indexes.push(index);
                }
            });

        return indexes;
    }

    getTopPixelAtCoordinate(coordinate: Point): Pixel {
        const index = this.getIndexAtCoordinate(coordinate);

        return this.bitMap.get(index) && last(this.bitMap.get(index));
    }

    private addPixelToMap(key: number, pixel: Pixel) {
        if (!this.bitMap.get(key)) {
            this.bitMap.set(key, []);
        }

        this.bitMap.get(key).push(pixel);
        this.bitMap.get(key).sort(this.sortByLayer)
    }

    private getIndexAtCoordinate(coordinate: Point): number {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xPixels = canvasDimensions.x / pixelSize;

        const xIndex = Math.floor(coordinate.x / pixelSize);
        const yIndex = Math.floor(coordinate.y / pixelSize);

        return yIndex * xPixels + xIndex;
    }


    private sortByLayer(a: Pixel, b: Pixel) {
        if (a.layer === -1) {
            return 1;
        } else if (b.layer === -1) {
            return -1;
        } else {
            return a.layer - b.layer;
        }
    }
}
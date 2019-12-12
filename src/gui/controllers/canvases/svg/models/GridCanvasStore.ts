import { Point, Polygon, Rectangle } from '@nightshifts.inc/geometry';
import { SvgConfig } from './SvgConfig';
import { last, without, sortNum } from '../../../../../model/utils/Functions';
import { WorldItemShape } from '../../../../../model/types/GameObject';

export enum PixelTag {
    SELECTED = 'selected'
}

export namespace PixelTag {
    export function removeTag(tag: PixelTag, tagged: {tags: PixelTag[]}[]) {
        tagged
            .filter(pixel => pixel.tags.includes(tag))
            .forEach(pixel => {
                pixel.tags = pixel.tags.filter(tag => tag !== tag)
            });
    }

    export function getTaggedItems<T extends {tags: PixelTag[]}>(tag: PixelTag, tagged: T[]): T[] {
        return tagged.filter(pixel => pixel.tags.includes(tag));
    }
}

export interface Pixel {
    type: string;
    index: number;
    isPreview: boolean;
    tags: PixelTag[];
    layer: number;
}

export interface FileData {
    fileName: string;
    data: string;
}

export interface CanvasItem {
    type: string;
    shape: WorldItemShape;
    color: string;
    indexes: number[];
    polygon: Polygon;
    tags: PixelTag[];
    layer: number;
    isPreview: boolean;
    model: FileData;
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

export class GridCanvasStore {
    bitMap: Map<number, Pixel[]> = new Map();
    pixels: Pixel[] = [];
    indexes: number[] = [];
    private bitmapConfig: SvgConfig;

    items: CanvasItem[] = [];

    constructor(bitmapConfig: SvgConfig) {
        this.bitmapConfig = bitmapConfig;
    }

    getPixel(index: number) {
        return this.bitMap.get(index)[0];
    }

    addRect(rectangle: Rectangle, type: string, layer: number, isPreview: boolean): CanvasItem {
        const indexes: number[] = [];

        for (let x = rectangle.topLeft.x; x < rectangle.bottomRight.x; x++) {
            for (let y = rectangle.topLeft.y; y < rectangle.bottomRight.y; y++) {
                indexes.push(this.getIndexAtPosition(new Point(x, y)));
            }
        }


        const canvasItem: CanvasItem = {
            color: 'grey',
            indexes,
            polygon: rectangle,
            type,
            layer,
            isPreview,
            tags: [],
            shape: WorldItemShape.RECTANGLE,
            model:  null
        }

        this.items.push(canvasItem);

        return canvasItem;
    }

    addRectangle(coordinates: Point[], type: string, layer: number, isPreview: boolean): CanvasItem {
        let indexes = coordinates.map(pos => this.getIndexAtCoordinate(pos));
        indexes = sortNum(indexes);

        const topLeft = this.getPixelPosition(indexes[0]);
        const botRight = this.getPixelPosition(indexes[indexes.length - 1]); 
        const canvasItem: CanvasItem = {
            color: 'grey',
            indexes,
            polygon: Polygon.createRectangle(topLeft.x, topLeft.y, botRight.x - topLeft.x, botRight.y - topLeft.y),
            type,
            layer,
            isPreview,
            tags: [],
            shape: WorldItemShape.RECTANGLE,
            model: null
        }

        this.items.push(canvasItem);

        return canvasItem;
    }

    removeRectangle(rect: CanvasItem) {
        this.items = without(this.items, rect);
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
            layer,
            tags: []
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
        this.items = [];
    }

    getPixelAtPosition(pos: Point) {

    }

    getPixelPosition(pixelIndex: number): Point {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xDim = canvasDimensions.x / pixelSize;

        const x = pixelIndex % xDim;
        const y = Math.floor(pixelIndex / xDim);
        
        return new Point(x, y);
    }

    getIntersectingItemsInRect(rectangle: Rectangle): CanvasItem[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const x = Math.floor(rectangle.topLeft.x / pixelSize);
        const y = Math.floor(rectangle.topLeft.y / pixelSize);
        const width = Math.floor((rectangle.bottomRight.x - rectangle.topLeft.x) / pixelSize);
        const height = Math.floor((rectangle.bottomRight.y - rectangle.topLeft.y) / pixelSize);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.items.filter(item => polygon.contains(item.polygon));
    }

    getIntersectingItemsAtPoint(point: Point): CanvasItem[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const gridPoint = new Point(point.x / pixelSize, point.y / pixelSize);

        return this.items.filter(item => item.polygon.containsPoint(gridPoint));
    }

    getTopPixelAtCoordinate(coordinate: Point): Pixel {
        const index = this.getIndexAtCoordinate(coordinate);

        return this.bitMap.get(index) && last(this.bitMap.get(index));
    }
    
    getIndexAtPosition(pos: Point) {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xPixels = canvasDimensions.x / pixelSize;

        return pos.y * xPixels + pos.x;
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
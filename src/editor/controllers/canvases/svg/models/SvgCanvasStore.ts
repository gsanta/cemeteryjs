import { Point } from '../../../../../model/geometry/shapes/Point';
import { Polygon } from '../../../../../model/geometry/shapes/Polygon';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';
import { without } from '../../../../../world_generator/utils/Functions';
import { CanvasPath } from '../tools/path/PathTool';
import { CanvasItemTag, CanvasRect } from './CanvasItem';
import { SvgConfig } from './SvgConfig';

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

export class SvgCanvasStore {
    private bitmapConfig: SvgConfig;

    private layers: Map<CanvasRect, number> = new Map();
    private tags: Map<CanvasRect, Set<CanvasItemTag>> = new Map();

    items: CanvasRect[] = [];
    pathes: CanvasPath[] = [];

    constructor(bitmapConfig: SvgConfig) {
        this.bitmapConfig = bitmapConfig;
    }

    addArrow(arrow: CanvasPath) {
        this.pathes.push(arrow);
    }

    addRect(canvasItem: CanvasRect): CanvasRect {
        this.items.push(canvasItem);

        this.layers.set(canvasItem, 0);

        return canvasItem;
    }

    removeRectangle(rect: CanvasRect) {
        this.items = without(this.items, rect);
    }

    clear(): void {
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

    getIntersectingItemsInRect(rectangle: Rectangle): CanvasRect[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const x = Math.floor(rectangle.topLeft.x / pixelSize);
        const y = Math.floor(rectangle.topLeft.y / pixelSize);
        const width = Math.floor((rectangle.bottomRight.x - rectangle.topLeft.x) / pixelSize);
        const height = Math.floor((rectangle.bottomRight.y - rectangle.topLeft.y) / pixelSize);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.items.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): CanvasRect[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const gridPoint = new Point(point.x / pixelSize, point.y / pixelSize);

        return this.items.filter(item => item.dimensions.containsPoint(gridPoint));
    }
    
    getIndexAtPosition(pos: Point) {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xPixels = canvasDimensions.x / pixelSize;

        return pos.y * xPixels + pos.x;
    }

    getLayer(canvasItem: CanvasRect) {
        return this.layers.get(canvasItem);
    }

    setLayer(canvasItem: CanvasRect, layer: number) {
        this.layers.set(canvasItem, layer);
    }

    getTags(canvasItem: CanvasRect): Set<CanvasItemTag> {
        return this.tags.get(canvasItem);
    }

    addTag(canvasItems: CanvasRect[], tag: CanvasItemTag): void {
        canvasItems.forEach(item => this.tags.get(item).add(tag));
    }

    removeTag(canvasItems: CanvasRect[], tag: CanvasItemTag) {
        canvasItems.forEach(item => this.tags.get(item).delete(tag));
    }

    getTaggedItems(tag: CanvasItemTag): CanvasRect[] {
        return this.items.filter(item => this.tags.get(item).has(tag));
    }

    getHoveredItem(): CanvasRect {
        return this.getTaggedItems(CanvasItemTag.HOVERED)[0];
    }

    getSelectedItems(): CanvasRect[] {
        return this.getTaggedItems(CanvasItemTag.SELECTED);
    }
}
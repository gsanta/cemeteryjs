import { Point } from '../../../../../model/geometry/shapes/Point';
import { Polygon } from '../../../../../model/geometry/shapes/Polygon';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';
import { without } from '../../../../../world_generator/utils/Functions';
import { CanvasPath } from '../tools/path/PathTool';
import { CanvasItemTag } from './CanvasItem';
import { SvgConfig } from './SvgConfig';
import { GameObject } from '../../../../../world_generator/services/GameObject';

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

    private layers: Map<GameObject, number> = new Map();
    private tags: Map<GameObject, Set<CanvasItemTag>> = new Map();

    items: GameObject[] = [];
    pathes: CanvasPath[] = [];

    constructor(bitmapConfig: SvgConfig) {
        this.bitmapConfig = bitmapConfig;
    }

    addArrow(arrow: CanvasPath) {
        this.pathes.push(arrow);
    }

    addRect(gameObject: GameObject): GameObject {
        this.items.push(gameObject);

        this.layers.set(gameObject, 0);
        this.tags.set(gameObject, new Set());

        return gameObject;
    }

    removeRectangle(gameObject: GameObject) {
        this.items = without(this.items, gameObject);
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

    getIntersectingItemsInRect(rectangle: Rectangle): GameObject[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const x = Math.floor(rectangle.topLeft.x / pixelSize);
        const y = Math.floor(rectangle.topLeft.y / pixelSize);
        const width = Math.floor((rectangle.bottomRight.x - rectangle.topLeft.x) / pixelSize);
        const height = Math.floor((rectangle.bottomRight.y - rectangle.topLeft.y) / pixelSize);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.items.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): GameObject[] {
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

    getLayer(gameObject: GameObject) {
        return this.layers.get(gameObject);
    }

    setLayer(gameObject: GameObject, layer: number) {
        this.layers.set(gameObject, layer);
    }

    getTags(gameObject: GameObject): Set<CanvasItemTag> {
        return this.tags.get(gameObject);
    }

    addTag(gameObject: GameObject[], tag: CanvasItemTag): void {
        gameObject.forEach(item => this.tags.get(item).add(tag));
    }

    removeTag(gameObject: GameObject[], tag: CanvasItemTag) {
        gameObject.forEach(item => this.tags.get(item).delete(tag));
    }

    getTaggedItems(tag: CanvasItemTag): GameObject[] {
        return this.items.filter(item => this.tags.get(item).has(tag));
    }

    getHoveredItem(): GameObject {
        return this.getTaggedItems(CanvasItemTag.HOVERED)[0];
    }

    getSelectedItems(): GameObject[] {
        return this.getTaggedItems(CanvasItemTag.SELECTED);
    }

    removeSelectionAll() {
        this.removeTag(this.getSelectedItems(), CanvasItemTag.SELECTED);
    }
}
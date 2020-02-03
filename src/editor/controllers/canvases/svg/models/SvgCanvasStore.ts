import { Point } from '../../../../../model/geometry/shapes/Point';
import { Polygon } from '../../../../../model/geometry/shapes/Polygon';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';
import { without } from '../../../../../world_generator/utils/Functions';
import { PathView } from '../tools/path/PathTool';
import { CanvasItemTag } from './CanvasItem';
import { SvgConfig } from './SvgConfig';
import { GameObject } from '../../../../../world_generator/services/GameObject';
import { View, ViewType } from '../../../../../model/View';

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

    private layers: Map<View, number> = new Map();
    private tags: Map<View, Set<CanvasItemTag>> = new Map();

    private views: View[] = [];

    constructor(bitmapConfig: SvgConfig) {
        this.bitmapConfig = bitmapConfig;
    }

    addPath(arrow: PathView) {
        this.views.push(arrow);
        this.tags.set(arrow, new Set());
    }

    addRect(gameObject: GameObject): GameObject {
        this.views.push(gameObject);

        this.layers.set(gameObject, 10);
        this.tags.set(gameObject, new Set());

        return gameObject;
    }

    remove(view: View) {
        this.views = without(this.views, view);
    }

    clear(): void {
        this.views = [];
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

    getIntersectingItemsInRect(rectangle: Rectangle): View[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const x = Math.floor(rectangle.topLeft.x / pixelSize);
        const y = Math.floor(rectangle.topLeft.y / pixelSize);
        const width = Math.floor((rectangle.bottomRight.x - rectangle.topLeft.x) / pixelSize);
        const height = Math.floor((rectangle.bottomRight.y - rectangle.topLeft.y) / pixelSize);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): View[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const gridPoint = new Point(point.x / pixelSize, point.y / pixelSize);

        return this.views.filter(item => item.dimensions.containsPoint(gridPoint));
    }
    
    getIndexAtPosition(pos: Point) {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xPixels = canvasDimensions.x / pixelSize;

        return pos.y * xPixels + pos.x;
    }

    getLayer(view: View) {
        return this.layers.get(view);
    }

    setLayer(view: View, layer: number) {
        this.layers.set(view, layer);
    }

    getTags(gameObject: View): Set<CanvasItemTag> {
        return this.tags.get(gameObject);
    }

    addTag(views: View[], tag: CanvasItemTag): void {
        views.forEach(item => this.tags.get(item).add(tag));
    }

    removeTag(gameObject: View[], tag: CanvasItemTag) {
        gameObject.forEach(item => this.tags.get(item).delete(tag));
    }

    getTaggedItems(tag: CanvasItemTag): View[] {
        return this.views.filter(item => this.tags.get(item).has(tag));
    }

    getViews(): View[] {
        return this.views;
    }

    getGameObjects(): GameObject[] {
        return <GameObject[]> this.views.filter(view => view.viewType === ViewType.GameObject);
    }

    getPathes(): PathView[] {
        return <PathView[]> this.views.filter(view => view.viewType === ViewType.Path);
    }

    getHoveredView(): View {
        return this.getTaggedItems(CanvasItemTag.HOVERED)[0];
    }

    getSelectedViews(): View[] {
        return this.getTaggedItems(CanvasItemTag.SELECTED);
    }

    getSelectedGameObjects(): GameObject[] {
        return <GameObject[]> this.getSelectedViews().filter(v => v.viewType === ViewType.GameObject);
    }

    removeSelectionAll() {
        this.removeTag(this.getSelectedViews(), CanvasItemTag.SELECTED);
    }
}
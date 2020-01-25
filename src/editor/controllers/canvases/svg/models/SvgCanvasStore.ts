import { Point } from '../../../../../model/geometry/shapes/Point';
import { Polygon } from '../../../../../model/geometry/shapes/Polygon';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';
import { WorldItemShape } from '../../../../../world_generator/services/GameObject';
import { sortNum, without } from '../../../../../world_generator/utils/Functions';
import { SvgConfig } from './SvgConfig';
import { CanvasItem } from './CanvasItem';
import { Path } from '../tools/PathTool';

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

    items: CanvasItem[] = [];
    arrows: Path[] = [];

    constructor(bitmapConfig: SvgConfig) {
        this.bitmapConfig = bitmapConfig;
    }

    addArrow(arrow: Path) {
        this.arrows.push(arrow);
    }

    addRect(canvasItem: CanvasItem): CanvasItem {
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
            dimensions: new Rectangle(topLeft, botRight),
            type,
            layer,
            isPreview,
            tags: new Set(),
            shape: WorldItemShape.RECTANGLE,
            model: null,
            rotation: 0,
            scale: 1,
            name: ''
        }

        this.items.push(canvasItem);

        return canvasItem;
    }

    removeRectangle(rect: CanvasItem) {
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

    getIntersectingItemsInRect(rectangle: Rectangle): CanvasItem[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        const x = Math.floor(rectangle.topLeft.x / pixelSize);
        const y = Math.floor(rectangle.topLeft.y / pixelSize);
        const width = Math.floor((rectangle.bottomRight.x - rectangle.topLeft.x) / pixelSize);
        const height = Math.floor((rectangle.bottomRight.y - rectangle.topLeft.y) / pixelSize);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.items.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): CanvasItem[] {
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

    private getIndexAtCoordinate(coordinate: Point): number {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xPixels = canvasDimensions.x / pixelSize;

        const xIndex = Math.floor(coordinate.x / pixelSize);
        const yIndex = Math.floor(coordinate.y / pixelSize);

        return yIndex * xPixels + xIndex;
    }
}
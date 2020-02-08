import { Point } from '../../../../../misc/geometry/shapes/Point';
import { Polygon } from '../../../../../misc/geometry/shapes/Polygon';
import { Rectangle } from '../../../../../misc/geometry/shapes/Rectangle';
import { without } from '../../../../../game/import/Functions';
import { CanvasItemTag } from './CanvasItem';
import { MeshView } from '../../../../../common/views/MeshView';
import { View, ViewType } from '../../../../../common/views/View';
import { PathView } from '../../../../../common/views/PathView';
import { Group } from '../../../../../common/views/Group';

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

export class ViewStore {
    private layers: Map<View, number> = new Map();
    private tags: Map<View, Set<CanvasItemTag>> = new Map();
    private groups: Group[] = [];

    private views: View[] = [];

    addPath(arrow: PathView) {
        this.views.push(arrow);
        this.tags.set(arrow, new Set());
    }

    addRect(gameObject: MeshView): MeshView {
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

    getIntersectingItemsInRect(rectangle: Rectangle): View[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): View[] {
        const gridPoint = new Point(point.x, point.y);

        return this.views.filter(item => item.dimensions.containsPoint(gridPoint));
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

    getViewsByType(viewType: ViewType): View[] {
        return this.views.filter(v => v.viewType === viewType);
    }

    getGameObjects(): MeshView[] {
        return <MeshView[]> this.views.filter(view => view.viewType === ViewType.GameObject);
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

    getSelectedGameObjects(): MeshView[] {
        return <MeshView[]> this.getSelectedViews().filter(v => v.viewType === ViewType.GameObject);
    }

    removeSelectionAll() {
        this.removeTag(this.getSelectedViews(), CanvasItemTag.SELECTED);
    }
}
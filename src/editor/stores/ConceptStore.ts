import { CanvasItemTag } from '../windows/canvas/models/CanvasItem';
import { MeshConcept } from '../windows/canvas/models/concepts/MeshConcept';
import { Concept, ConceptType } from '../windows/canvas/models/concepts/Concept';
import { PathConcept } from '../windows/canvas/models/concepts/PathConcept';
import { without, maxBy } from '../../misc/geometry/utils/Functions';
import { Rectangle } from '../../misc/geometry/shapes/Rectangle';
import { Point } from '../../misc/geometry/shapes/Point';
import { Polygon } from '../../misc/geometry/shapes/Polygon';

export class ConceptStore {
    private tags: Map<Concept, Set<CanvasItemTag>> = new Map();
    private views: Concept[] = [];
    private naming: Naming;

    constructor() {
        this.naming = new Naming(this);
    }

    addPath(arrow: PathConcept) {
        this.views.push(arrow);
        this.tags.set(arrow, new Set());
    }

    addRect(gameObject: MeshConcept): MeshConcept {
        this.views.push(gameObject);

        this.tags.set(gameObject, new Set());

        return gameObject;
    }

    remove(view: Concept) {
        this.views = without(this.views, view);
    }

    clear(): void {
        this.views = [];
        this.tags = new Map();
    }

    getIntersectingItemsInRect(rectangle: Rectangle): Concept[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): Concept[] {
        const gridPoint = new Point(point.x, point.y);

        return this.views.filter(item => item.dimensions.containsPoint(gridPoint));
    }

    getTags(gameObject: Concept): Set<CanvasItemTag> {
        return this.tags.get(gameObject);
    }

    addTag(views: Concept[], tag: CanvasItemTag): void {
        views.forEach(item => this.tags.get(item).add(tag));
    }

    removeTag(views: Concept[], tag: CanvasItemTag) {
        views.forEach(item => this.tags.get(item).delete(tag));
    }

    removeTagFromAll(tag: CanvasItemTag) {
        this.views.forEach(item => this.tags.get(item).delete(tag));
    }

    getTaggedItems(tag: CanvasItemTag): Concept[] {
        return this.views.filter(item => this.tags.get(item).has(tag));
    }

    getViews(): Concept[] {
        return this.views;
    }

    getViewsByType(viewType: ConceptType): Concept[] {
        return this.views.filter(v => v.conceptType === viewType);
    }

    getGameObjects(): MeshConcept[] {
        return <MeshConcept[]> this.views.filter(view => view.conceptType === ConceptType.Mesh);
    }

    getPathes(): PathConcept[] {
        return <PathConcept[]> this.views.filter(view => view.conceptType === ConceptType.Path);
    }

    getHoveredView(): Concept {
        return this.getTaggedItems(CanvasItemTag.HOVERED)[0];
    }

    getSelectedViews(): Concept[] {
        return this.getTaggedItems(CanvasItemTag.SELECTED);
    }

    getSelectedPathes(): PathConcept[] {
        return <PathConcept[]> this.getSelectedViews().filter(v => v.conceptType === ConceptType.Path);
    }

    getSelectedGameObjects(): MeshConcept[] {
        return <MeshConcept[]> this.getSelectedViews().filter(v => v.conceptType === ConceptType.Mesh);
    }

    removeSelectionAll() {
        this.removeTag(this.getSelectedViews(), CanvasItemTag.SELECTED);
    }

    generateUniqueName(viewType: ConceptType) {
        return this.naming.generateName(viewType);
    }
}

export class Naming {
    private viewStore: ConceptStore;

    constructor(viewStore: ConceptStore) {
        this.viewStore = viewStore;
    }

    generateName(type: ConceptType) {
        const name = `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
        return name;
    }

    private getMaxIndex(type: ConceptType): number {
        const pattern = this.createPattern(type);
        const views = this.viewStore.getViewsByType(type).filter(view => view.name.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<Concept>(views, (a, b) => parseInt(a.name.match(pattern)[1], 10) - parseInt(b.name.match(pattern)[1], 10));
            return parseInt(max.name.match(pattern)[1], 10);
        }

    }

    private createPattern(type: ConceptType) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}
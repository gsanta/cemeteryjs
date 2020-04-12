import { Concept, ConceptType } from "../views/canvas/models/concepts/Concept";
import { Feedback } from "../views/canvas/models/feedbacks/Feedback";
import { without, maxBy } from "../../misc/geometry/utils/Functions";
import { MeshConcept } from "../views/canvas/models/concepts/MeshConcept";
import { PathConcept } from "../views/canvas/models/concepts/PathConcept";
import { Stores } from "./Stores";
import { Polygon } from "../../misc/geometry/shapes/Polygon";
import { Point } from "../../misc/geometry/shapes/Point";
import { Rectangle } from "../../misc/geometry/shapes/Rectangle";
import { MetaConcept } from "../views/canvas/models/meta/MetaConcept";
import { AnimationConcept } from "../views/canvas/models/meta/AnimationConcept";
import { VisualConcept } from "../views/canvas/models/concepts/VisualConcept";

export interface TypedItem {
    type: string;
}

export function isFeedback(item: TypedItem) {
    return item.type.endsWith('Feedback');
}

export function isConcept(item: TypedItem) {
    return item.type.endsWith('Concept');
}

export class CanvasStore {
    concepts: VisualConcept[] = [];
    feedbacks: Feedback[] = [];
    metas: MetaConcept[] = [];

    private naming: Naming;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
        this.naming = new Naming(this);
    }

    addConcept(concept: VisualConcept) {
        this.concepts.push(concept);
    }

    addFeedback(feedback: Feedback) {
        this.feedbacks.push(feedback);
    }

    addMeta(metaConcept: MetaConcept) {
        this.metas.push(metaConcept);
    }

    removeMeta(metaConcept: MetaConcept) {
        this.metas = without(this.metas, metaConcept);
    }

    removeConcept(concept: VisualConcept) {
        this.concepts = without(this.concepts, concept);
        this.getStores().hoverStore.removeItem(concept);
        this.getStores().selectionStore.removeItem(concept);
    }

    clear(): void {
        this.concepts = [];
        this.feedbacks = [];
    }

    hasMeta(concept: MetaConcept) {
        return this.metas.indexOf(concept) !== -1;
    }

    getAllConcepts(): Concept[] {
        return this.concepts;
    }

    getConceptsByType(type: ConceptType): Concept[] {
        return this.concepts.filter(v => v.type === type);
    }

    getMeshConcepts(): MeshConcept[] {
        return <MeshConcept[]> this.concepts.filter(view => view.type === ConceptType.MeshConcept);
    }

    getPathConcepts(): PathConcept[] {
        return <PathConcept[]> this.concepts.filter(view => view.type === ConceptType.PathConcept);
    }

    getAnimationConcepts(): AnimationConcept[] {
        return <AnimationConcept[]> this.metas.filter(view => view.type === ConceptType.AnimationConcept);
    }

    getAnimationConceptById(id: string): AnimationConcept {
        return <AnimationConcept> this.metas.find(meta => meta.id === id);
    }

    getIntersectingItemsInRect(rectangle: Rectangle): VisualConcept[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.concepts.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): VisualConcept[] {
        const gridPoint = new Point(point.x, point.y);

        return this.concepts.filter(item => item.dimensions.containsPoint(gridPoint));
    }

    generateUniqueName(viewType: ConceptType) {
        return this.naming.generateName(viewType);
    }
}

export class Naming {
    private canvasStore: CanvasStore;

    constructor(canvasStore: CanvasStore) {
        this.canvasStore = canvasStore;
    }

    generateName(type: ConceptType) {
        const name = `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
        return name;
    }

    private getMaxIndex(type: ConceptType): number {
        const pattern = this.createPattern(type);
        const views = this.canvasStore.getConceptsByType(type).filter(view => view.id.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<Concept>(views, (a, b) => parseInt(a.id.match(pattern)[1], 10) - parseInt(b.id.match(pattern)[1], 10));
            return parseInt(max.id.match(pattern)[1], 10);
        }

    }

    private createPattern(type: ConceptType) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}
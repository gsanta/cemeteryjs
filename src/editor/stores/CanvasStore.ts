import { Concept, ConceptType } from "../models/concepts/Concept";
import { Feedback } from "../models/feedbacks/Feedback";
import { without, maxBy } from "../../misc/geometry/utils/Functions";
import { MeshConcept } from "../models/concepts/MeshConcept";
import { PathConcept } from "../models/concepts/PathConcept";
import { Stores } from "./Stores";
import { Polygon } from "../../misc/geometry/shapes/Polygon";
import { Point } from "../../misc/geometry/shapes/Point";
import { Rectangle } from "../../misc/geometry/shapes/Rectangle";
import { MetaConcept } from "../models/meta/MetaConcept";
import { AnimationConcept } from "../models/meta/AnimationConcept";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { ModelConcept } from "../models/concepts/ModelConcept";
import { Registry } from "../Registry";

export function isFeedback(type: string) {
    return type.endsWith('Feedback');
}

export function isConcept(type: string) {
    return type.endsWith('Concept');
}

export function isMeta(type: string) {
    return type === ConceptType.ModelConcept;
}

export class CanvasStore {
    concepts: VisualConcept[] = [];
    feedbacks: Feedback[] = [];
    metas: MetaConcept[] = [];

    private naming: Naming;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
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
        this.registry.stores.hoverStore.removeItem(concept);
        this.registry.stores.selectionStore.removeItem(concept);
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
        if (isMeta(type)) {
            return this.metas.filter(v => v.type === type);
        } else if (isConcept(type)) {
            return this.concepts.filter(v => v.type === type);
        }
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

    getModelConcepts(): ModelConcept[] {
        return <ModelConcept[]> this.metas.filter(view => view.type === ConceptType.ModelConcept);
    }

    getModelConceptById(id: string): ModelConcept {
        return <ModelConcept> this.metas.find(meta => meta.id === id);
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
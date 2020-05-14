import { Point } from "../geometry/shapes/Point";
import { Polygon } from "../geometry/shapes/Polygon";
import { Rectangle } from "../geometry/shapes/Rectangle";
import { without } from "../geometry/utils/Functions";
import { MeshConcept } from "../models/concepts/MeshConcept";
import { ModelConcept } from "../models/concepts/ModelConcept";
import { PathConcept } from "../models/concepts/PathConcept";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { IControl } from "../models/controls/IControl";
import { AnimationConcept } from "../models/meta/AnimationConcept";
import { MetaConcept } from "../models/meta/MetaConcept";
import { Registry } from "../Registry";
import { AbstractStore } from './AbstractStore';
import { ConceptType, Concept } from "../models/concepts/Concept";

export function isControl(type: string) {
    return type.endsWith('Feedback');
}

export function isConcept(type: string) {
    return type.endsWith('Concept');
}

export function isMeta(type: string) {
    return type === ConceptType.ModelConcept;
}

export class CanvasStore extends AbstractStore {
    concepts: VisualConcept[] = [];
    controls: IControl<any>[] = [];
    metas: MetaConcept[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addConcept(concept: VisualConcept) {
        this.concepts.push(concept);
    }

    addControl(control: IControl<any>) {
        this.controls.push(control);
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
        this.registry.services.game.deleteConcepts([concept]);
    }

    removeItemById(id: string) {
        const concept = this.concepts.find(concept => concept.id === id);
        this.removeConcept(concept);
    }

    clear(): void {
        this.concepts = [];
        this.controls = [];
        this.metas = [];
    }

    hasMeta(concept: MetaConcept) {
        return this.metas.indexOf(concept) !== -1;
    }

    getAllConcepts(): Concept[] {
        return this.concepts;
    }

    getItemsByType(type: string): Concept[] {
        if (isMeta(type)) {
            return this.metas.filter(v => v.type === type);
        } else if (isControl(type)) {
            return this.controls.filter(c => c.type === type);
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
}
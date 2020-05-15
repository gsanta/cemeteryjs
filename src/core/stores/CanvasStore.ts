import { Point } from "../geometry/shapes/Point";
import { Polygon } from "../geometry/shapes/Polygon";
import { Rectangle } from "../geometry/shapes/Rectangle";
import { without } from "../geometry/utils/Functions";
import { MeshView } from "../models/views/MeshView";
import { ModelConcept } from "../models/concepts/ModelConcept";
import { PathView } from "../models/views/PathView";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { IControl } from "../models/views/control/IControl";
import { AnimationConcept } from "../models/meta/AnimationConcept";
import { MetaConcept } from "../models/meta/MetaConcept";
import { Registry } from "../Registry";
import { AbstractStore } from './AbstractStore';
import { ConceptType, View } from "../models/views/View";

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
    views: VisualConcept[] = [];
    controls: IControl<any>[] = [];
    metas: MetaConcept[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addConcept(concept: VisualConcept) {
        this.views.push(concept);
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
        this.views = without(this.views, concept);
        this.registry.stores.hoverStore.removeItem(concept);
        this.registry.stores.selectionStore.removeItem(concept);
        this.registry.services.game.deleteConcepts([concept]);
    }

    removeItemById(id: string) {
        const concept = this.views.find(concept => concept.id === id);
        this.removeConcept(concept);
    }

    clear(): void {
        this.views = [];
        this.controls = [];
        this.metas = [];
    }

    hasMeta(concept: MetaConcept) {
        return this.metas.indexOf(concept) !== -1;
    }

    getAllConcepts(): View[] {
        return this.views;
    }

    getItemsByType(type: string): View[] {
        if (isMeta(type)) {
            return this.metas.filter(v => v.type === type);
        } else if (isControl(type)) {
            return this.controls.filter(c => c.type === type);
        } else if (isConcept(type)) {
            return this.views.filter(v => v.type === type);
        }
    }

    getMeshConcepts(): MeshView[] {
        return <MeshView[]> this.views.filter(view => view.type === ConceptType.MeshConcept);
    }

    getPathConcepts(): PathView[] {
        return <PathView[]> this.views.filter(view => view.type === ConceptType.PathConcept);
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

    getIntersectingItemsAtPoint(point: Point): VisualConcept[] {
        const gridPoint = new Point(point.x, point.y);

        return this.views.filter(item => item.dimensions.containsPoint(gridPoint));
    }
}
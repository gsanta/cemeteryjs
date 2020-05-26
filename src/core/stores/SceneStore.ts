import { Point } from "../geometry/shapes/Point";
import { without } from "../geometry/utils/Functions";
import { ModelConcept } from "../models/concepts/ModelConcept";
import { AnimationConcept } from "../models/meta/AnimationConcept";
import { ChildView } from "../models/views/child_views/ChildView";
import { MeshView } from "../models/views/MeshView";
import { PathView } from "../models/views/PathView";
import { ConceptType, View } from "../models/views/View";
import { Registry } from "../Registry";
import { AbstractStore } from './AbstractStore';

export function isControl(type: string) {
    return type.endsWith('Feedback');
}

export function isConcept(type: string) {
    return type.endsWith('Concept');
}

export function isMeta(type: string) {
    return type === ConceptType.ModelConcept;
}

export class SceneStore extends AbstractStore {
    views: View[] = [];
    controls: ChildView<any>[] = [];
    models: ModelConcept[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addConcept(concept: View) {
        this.views.push(concept);
    }

    addControl(control: ChildView<any>) {
        this.controls.push(control);
    }

    addModel(model: ModelConcept) {
        this.models.push(model);
    }

    removeModel(model: ModelConcept) {
        this.models = without(this.models, model);
    }

    removeConcept(concept: View) {
        this.views = without(this.views, concept);
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
        this.models = [];
    }

    hasModel(model: ModelConcept) {
        return this.models.indexOf(model) !== -1;
    }

    getAllConcepts(): View[] {
        return this.views;
    }

    getItemsByType(type: string): View[] {
        if (isControl(type)) {
            return this.controls.filter(c => c.type === type);
        } else if (isConcept(type)) {
            return this.views.filter(v => v.type === type);
        }
    }

    getMeshConcepts(): MeshView[] {
        return <MeshView[]> this.views.filter(view => view.type === ConceptType.MeshConcept);
    }

    getMeshViewById(id: string): MeshView {
        return <MeshView> this.views.find(view => view.id === id);
    }

    getPathConcepts(): PathView[] {
        return <PathView[]> this.views.filter(view => view.type === ConceptType.PathConcept);
    }

    getPathViewById(id: string): PathView {
        return <PathView> this.views.find(view => view.id === id);
    }

    getModelConcepts(): ModelConcept[] {
        return <ModelConcept[]> this.models.filter(view => view.type === ConceptType.ModelConcept);
    }

    getModelConceptById(id: string): ModelConcept {
        return <ModelConcept> this.models.find(meta => meta.id === id);
    }

    getIntersectingItemsAtPoint(point: Point): View[] {
        const gridPoint = new Point(point.x, point.y);

        return this.views.filter(item => item.dimensions.containsPoint(gridPoint));
    }
}
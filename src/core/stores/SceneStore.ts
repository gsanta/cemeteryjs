import { Point } from "../geometry/shapes/Point";
import { without } from "../geometry/utils/Functions";
import { ModelConcept } from "../models/ModelConcept";
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

    addConcept(view: View) {
        view.id = view.id === undefined ? this.generateUniqueName(view.type) : view.id;
        super.addItem(view);
        this.views.push(view);
    }

    addControl(control: ChildView<any>) {
        super.addItem(control);
        this.controls.push(control);
    }

    addModel(model: ModelConcept) {
        super.addItem(model);
        this.models.push(model);
    }

    removeModel(model: ModelConcept) {
        super.removeItem(model);
        this.models = without(this.models, model);
    }

    removeItem(view: View) {
        super.removeItem(view);
        this.views = without(this.views, view);
        this.registry.stores.selectionStore.removeItem(view);
        this.registry.services.game.deleteConcepts([view]);
    }

    clear(): void {
        super.clear();
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
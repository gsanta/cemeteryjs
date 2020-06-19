import { Point } from "../geometry/shapes/Point";
import { without } from "../geometry/utils/Functions";
import { ChildView } from "../models/views/child_views/ChildView";
import { MeshView } from "../models/views/MeshView";
import { PathView } from "../models/views/PathView";
import { ViewType, View } from "../models/views/View";
import { Registry } from "../Registry";
import { AbstractStore } from './AbstractStore';
import { AbstractViewStore } from "./AbstractViewStore";

export function isFeedback(type: string) {
    return type.endsWith('Feedback');
}

export function isView(type: string) {
    return type.endsWith('View');
}

export class SceneStore extends AbstractViewStore {
    views: View[] = [];
    controls: ChildView<any>[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addMeshView(meshView: MeshView) {
        this.addView(meshView);
        this.registry.stores.meshStore.createInstance((<MeshView> meshView).model);
    }

    //TODO make it protected
    addView(view: View) {
        view.id = view.id === undefined ? this.generateUniqueName(view.viewType) : view.id;
        super.addItem(view);
        this.views.push(view);
    }

    addControl(control: ChildView<any>) {
        super.addItem(control);
        this.controls.push(control);
    }

    removeItem(view: View) {
        super.removeItem(view);
        this.views = without(this.views, view);
        this.registry.stores.selectionStore.removeItem(view);

        if (view.viewType === ViewType.MeshView) {
            this.registry.stores.meshStore.deleteInstance((<MeshView> view).mesh);
        }
    }

    clear(): void {
        super.clear();
        this.getMeshViews().forEach(meshView => meshView.mesh && this.registry.stores.meshStore.deleteInstance(meshView.mesh));
        this.views = [];
        this.controls = [];
    }
    
    getAllViews(): View[] {
        return this.views;
    }

    getMeshViews(): MeshView[] {
        return <MeshView[]> this.views.filter(view => view.viewType === ViewType.MeshView);
    }

    getMeshViewById(id: string): MeshView {
        return <MeshView> this.views.find(view => view.id === id);
    }

    getPathViews(): PathView[] {
        return <PathView[]> this.views.filter(view => view.viewType === ViewType.PathView);
    }

    getPathViewById(id: string): PathView {
        return <PathView> this.views.find(view => view.id === id);
    }

    getIntersectingItemsAtPoint(point: Point): View[] {
        const gridPoint = new Point(point.x, point.y);

        return this.views.filter(item => item.dimensions.containsPoint(gridPoint));
    }
}
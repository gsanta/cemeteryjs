import { Point } from "../../utils/geometry/shapes/Point";
import { AssetObject, AssetType } from "./game_objects/AssetObject";
import { ChildView } from "./views/child_views/ChildView";
import { MeshView } from "./views/MeshView";
import { PathView } from "./views/PathView";
import { View, ViewType } from "./views/View";
import { Registry } from "../Registry";
import { AbstractViewStore } from "./AbstractViewStore";
import { AssetStore } from "./AssetStore";
import { without } from "../../utils/geometry/Functions";

export function isFeedback(type: string) {
    return type.endsWith('Feedback');
}

export function isView(type: string) {
    return type.endsWith('View');
}

export class SceneStore extends AbstractViewStore {
    static id = 'scene-store'; 
    id = SceneStore.id;
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

    listen(action: string, changedItems: any[]) {
        switch(action) {
            case AssetStore.actions.ASSET_DELETE:
                changedItems.forEach(item => this.removeAsset(<AssetObject> item));
            break;
        }
    }

    private removeAsset(asset: AssetObject) {
        switch(asset.assetType) {
            case AssetType.Model:
                this.getMeshViews()
                    .filter(v => v.modelId === asset.id)
                    .forEach(view => this.removeItem(view));
        }
    }
}
import { Point } from "../../utils/geometry/shapes/Point";
import { AssetObj, AssetType } from "../models/game_objects/AssetObj";
import { ChildView } from "../models/views/child_views/ChildView";
import { MeshView } from "../models/views/MeshView";
import { PathView } from "../models/views/PathView";
import { View, ViewType } from "../models/views/View";
import { Registry } from "../Registry";
import { AbstractViewStore } from "./AbstractViewStore";
import { AssetStore } from "./AssetStore";
import { without } from "../../utils/geometry/Functions";
import { MeshObj } from "../models/game_objects/MeshObj";
import { UI_Region } from "../plugins/UI_Plugin";
import { SpriteView, SpriteViewType } from "../models/views/SpriteView";
import { SpriteObj } from "../models/game_objects/SpriteObj";

export function isFeedback(type: string) {
    return type.endsWith('Feedback');
}

export function isView(type: string) {
    return type.endsWith('View');
}

export class SceneStore extends AbstractViewStore<MeshView | SpriteView | PathView> {
    static id = 'scene-store'; 
    id = SceneStore.id;
    views: View[] = [];
    controls: ChildView<any>[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    private addMeshView(meshView: MeshView) {
        this.registry.engine.meshes.createInstance((<MeshView> meshView).obj)
            .finally(() => {
                const size = this.registry.engine.meshes.getDimensions(meshView.obj);
                meshView.dimensions.setWidth(size.x);
                meshView.dimensions.setHeight(size.y);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            });
    }

    addView(view: View) {
        view.id = view.id === undefined ? this.generateId(view.viewType) : view.id;
        view.obj.id = view.id;
        super.addItem(view);
        this.views.push(view);


        switch(view.viewType) {
            case ViewType.MeshView:
                this.addMeshView(view as MeshView);
            break;
        }
    }

    removeItem(view: View) {
        super.removeItem(view);
        this.views = without(this.views, view);
        this.registry.stores.selectionStore.removeItem(view);

        if (view.viewType === ViewType.MeshView) {
            this.registry.engine.meshes.deleteInstance(view.obj as MeshObj);
        } else if (view.viewType === SpriteViewType) {
            this.registry.engine.sprites.deleteInstance(view.obj as SpriteObj);
        }
    }

    clear(): void {
        super.clear();
        this.getMeshViews().forEach(meshView => this.registry.engine.meshes.deleteInstance(meshView.obj));
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
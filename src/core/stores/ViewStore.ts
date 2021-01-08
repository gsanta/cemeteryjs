import { MoveAxisViewType } from "../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/views/MoveAxisView";
import { RotateAxisViewType } from "../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/views/RotateAxisView";
import { ScaleAxisViewType } from "../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/views/ScaleAxisView";
import { NodeViewType } from "../../plugins/canvas_plugins/node_editor/views/NodeView";
import { LightViewType } from '../../plugins/canvas_plugins/scene_editor/views/LightView';
import { MeshViewType } from "../../plugins/canvas_plugins/scene_editor/views/MeshView";
import { SpriteViewType } from "../../plugins/canvas_plugins/scene_editor/views/SpriteView";
import { without } from "../../utils/geometry/Functions";
import { Polygon } from "../../utils/geometry/shapes/Polygon";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { NodeObj } from "../models/objs/node_obj/NodeObj";
import { AfterAllViewsDeserialized, View, ViewFactory, ViewTag } from '../models/views/View';
import { Registry } from "../Registry";
import { AppJson } from "../services/export/ExportService";
import { IdGenerator } from "./IdGenerator";

export const sceneAndGameViewRatio = 10;

export function getIntersectingViews(store: ViewStore, rectangle: Rectangle): View[] {
    const x = rectangle.topLeft.x;
    const y = rectangle.topLeft.y;
    const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
    const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

    const polygon = Polygon.createRectangle(x, y, width, height);

    return store.getAllViews().filter(item => polygon.contains(item.getBounds().toPolygon()));
}

export interface ViewStoreHook {
    addViewHook(view: View);
    removeViewHook(view: View);
    addSelectionHook(views: View[]);
    removeSelectionHook(views: View[]);
}

export abstract class EmptyViewStoreHook implements ViewStoreHook {
    addViewHook(view: View) {}
    removeViewHook(view: View) {}
    addSelectionHook(views: View[]) {}
    removeSelectionHook(views: View[]) {}
}

export class ViewStore {
    protected views: View[] = [];
    private selectedViews: View[] = [];
    protected idMap: Map<string, View> = new Map();
    protected byObjIdMap: Map<string, View> = new Map();
    private viewsByType: Map<string, View[]> = new Map();
    protected idGenerator: IdGenerator;
    private hooks: ViewStoreHook[] = [];
    private viewFactories: Map<string, ViewFactory> = new Map();

    readonly canvasId: string;
    private registry: Registry;

    constructor(canvasId: string, registry: Registry) {
        this.canvasId = canvasId;
        this.registry = registry;
        this.setIdGenerator(new IdGenerator());
    }

    exportInto(appjson: Partial<AppJson>) {
        appjson.canvas[this.canvasId] = this.views.map(view => view.toJson());
    }

    importFrom(appJson: AppJson) {
        const afterAllViewsDeserializedFuncs: AfterAllViewsDeserialized[] = [];

        appJson.canvas[this.canvasId].forEach(viewJson => {
            let viewInstance: View;
            let afterAllViewsDeserialized: AfterAllViewsDeserialized;
        
            if (viewJson.type === NodeViewType) {
                const nodeObj = (<NodeObj> this.registry.stores.objStore.getById(viewJson.objId));
                viewInstance = this.registry.data.helper.node.createView(nodeObj.type, nodeObj)
                viewInstance.fromJson(viewJson, this.registry);
            } else if (viewJson.type === MeshViewType || viewJson.type === LightViewType) {
                [viewInstance, afterAllViewsDeserialized] = this.getViewFactory(viewJson.type).instantiateFromJson(viewJson);
                afterAllViewsDeserializedFuncs.push(afterAllViewsDeserialized);
            } else {
                viewInstance = this.getViewFactory(viewJson.type).instantiate();
                viewInstance.fromJson(viewJson, this.registry);
            }
            this.addView(viewInstance);
        });

        afterAllViewsDeserializedFuncs.forEach(func => func());
    }

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    generateId(view: View): string {
        return this.idGenerator.generateId(view.viewType);
    }

    addHook(hook: ViewStoreHook) {
        this.hooks.push(hook);
    }

    removeHook(hook: ViewStoreHook) {
        this.hooks.splice(this.hooks.indexOf(hook), 1);
    }

    registerViewType(viewType: string, viewFactory: ViewFactory) {
        this.viewFactories.set(viewType, viewFactory);
    }

    getViewFactory(viewType: string): ViewFactory {
        return this.viewFactories.get(viewType);
    }

    addView(view: View) {
        if (!view.id) {
            view.id = this.generateId(view);
        }
        this.idGenerator.registerExistingIdForPrefix(view.viewType, view.id);

        this.views.push(view);
        this.idMap.set(view.id, view);
        view.getObj() && this.byObjIdMap.set(view.getObj().id, view);

        if (!this.viewsByType.get(view.viewType)) {
            this.viewsByType.set(view.viewType, []);
        }

        this.viewsByType.get(view.viewType).push(view);
        
        this.hooks.forEach(hook => hook.addViewHook(view));
    }

    removeView(view: View) {
        if (view.isSelected()) {
            this.removeSelectedView(view);
        }

        view.deleteConstraiedViews.getViews().forEach(v => this.removeView(v));

        this.idGenerator.unregisterExistingIdForPrefix(view.viewType, view.id);
        this.idMap.delete(view.id);
        if (view.getObj()) {
            this.byObjIdMap.delete(view.getObj().id);
        }

        const thisViewTypes = this.viewsByType.get(view.viewType);
        thisViewTypes.splice(thisViewTypes.indexOf(view), 1);
        this.views.splice(this.views.indexOf(view), 1);
        this.selectedViews.indexOf(view) !== -1 && this.selectedViews.splice(this.selectedViews.indexOf(view), 1);
        view.dispose();

        this.hooks.forEach(hook => hook.removeViewHook(view));
    }

    hasView(id: string): boolean {
        return this.idMap.has(id);
    }

    getById(id: string): View {
        return this.idMap.get(id);
    }

    getByObjId(objId: string): View {
        return this.byObjIdMap.get(objId);
    }

    getViewsByType(type: string): View[] {
        return this.viewsByType.get(type) || [];
    }

    getAllTypes(): string[] {
        return Array.from(this.viewsByType.keys());
    }

    getAllViews(): View[]  {
        return this.views;
    }

    addSelectedView(...items: View[]) {
        items.forEach(item => item.tags.add(ViewTag.Selected));
        this.selectedViews.push(...items);

        this.hooks.forEach(hook => hook.addSelectionHook(items));
        this.registry.services.event.select.emit();
    }

    removeSelectedView(item: View) {
        item.tags.delete(ViewTag.Selected)
        this.selectedViews = without(this.selectedViews, item);

        this.hooks.forEach(hook => hook.removeSelectionHook([item]));
        this.registry.services.event.select.emit();
    }

    getSelectedViews(): View[] {
        return this.selectedViews;
    }

    getSelectedViewsByType(type: string): View[] {
        return this.selectedViews.filter(view => view.viewType === type);
    }

    getOneSelectedView(): View {
        return this.selectedViews.length > 0 && this.selectedViews[0];
    }

    clearSelection() {
        this.selectedViews.forEach(item => this.removeSelectedView(item));
        this.selectedViews = [];
    }

    clear() {
        while(this.views.length > 0) {
            this.removeView(this.views[0]);
        }
        this.idMap = new Map();
        this.viewsByType = new Map();
        this.byObjIdMap = new Map();
        this.idGenerator.clear();
        this.clearSelection();
    }

    static newInstance(canvasId: string, registry: Registry): ViewStore {
        const viewStore = new ViewStore(canvasId, registry);
        const proxy = new Proxy(viewStore, handler);
        return proxy;
    }
}

const handler = {
    get: function(target: ViewStore, prop, receiver) {
		var propValue = target[prop];
        if (typeof propValue != "function") {
			return target.getById(prop);
		}
		else{
			return function(){
				//"this" points to the proxy, is like using the "receiver" that the proxy has captured
				return propValue.apply(target, arguments);
			}
		}
    }
};

export class ViewLifeCycleHook extends EmptyViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    removeViewHook(view: View) {
        view.getObj() && this.registry.stores.objStore.removeObj(view.getObj());
    }
}

export class AxisControlHook extends EmptyViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addSelectionHook(views: View[]) {
        if (views.length === 1 && (views[0].viewType === SpriteViewType || views[0].viewType === MeshViewType)) {
            this.registry.data.view.scene.getViewFactory(MoveAxisViewType).instantiateOnSelection(views[0])
            this.registry.data.view.scene.getViewFactory(ScaleAxisViewType).instantiateOnSelection(views[0])
            this.registry.data.view.scene.getViewFactory(RotateAxisViewType).instantiateOnSelection(views[0])
        }
    }

    removeSelectionHook(views: View[]) {
        views.forEach(view => {
            view.containedViews.filter(view => view.viewType === MoveAxisViewType).forEach(child => view.deleteContainedView(child));
            view.containedViews.filter(view => view.viewType === ScaleAxisViewType).forEach(child => view.deleteContainedView(child));
            view.containedViews.filter(view => view.viewType === RotateAxisViewType).forEach(child => view.deleteContainedView(child));
        });
    }
}
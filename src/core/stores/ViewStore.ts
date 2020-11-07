import { View, ViewTag } from "../models/views/View";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { Polygon } from "../../utils/geometry/shapes/Polygon";
import { IdGenerator } from "./IdGenerator";
import { without } from "../../utils/geometry/Functions";
import { Registry } from "../Registry";
import { MoveAxisView, MoveAxisViewType } from "../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/views/MoveAxisView";
import { SpriteViewType } from "../models/views/SpriteView";
import { MeshViewType } from "../models/views/MeshView";
import { CanvasAxis } from "../models/misc/CanvasAxis";
import { ScaleAxisView, ScaleAxisViewType } from "../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/views/ScaleAxisView";
import { AppJson } from "../services/export/ExportService";
import { NodeObj } from "../models/objs/NodeObj";
import { NodeViewType } from "../models/views/NodeView";

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
    private viewFactories: Map<string, () => View> = new Map();

    readonly canvasId: string;
    private registry: Registry;

    constructor(canvasId: string, registry: Registry) {
        this.canvasId = canvasId;
        this.registry = registry;
    }

    exportInto(appjson: Partial<AppJson>) {
        appjson.canvas[this.canvasId] = this.views.map(view => view.toJson());
    }

    importFrom(appJson: AppJson) {
        appJson.canvas[this.canvasId].forEach(viewJson => {
            let viewInstance: View;
            if (viewJson.type === NodeViewType) {
                const nodeType = (<NodeObj> this.registry.stores.objStore.getById(viewJson.objId)).type;
                viewInstance = this.registry.data.helper.node.createView(nodeType)
            } else {
                viewInstance = this.createView(viewJson.type);
            }
            viewInstance.fromJson(viewJson, this.registry);
            this.registry.stores.views.addView(viewInstance);
        });
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

    registerViewType(viewType: string, createView: () => View) {
        this.viewFactories.set(viewType, createView);
    }

    createView(viewType: string): View {
        const view = this.viewFactories.get(viewType)();
        view.id = this.generateId(view);
        return view;
    }

    addView(view: View) {
        this.idGenerator.registerExistingIdForPrefix(view.viewType, view.id);
        // if (view.id) {
        // } else {
        //     view.id = this.idGenerator.generateId(view.viewType);
        // }

        this.views.push(view);
        this.idMap.set(view.id, view);
        this.byObjIdMap.set(view.getObj().id, view);

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

        this.idGenerator.unregisterExistingIdForPrefix(view.viewType, view.id);

        this.hooks.forEach(hook => hook.removeViewHook(view));

        this.idMap.delete(view.id);

        const thisViewTypes = this.viewsByType.get(view.viewType);
        thisViewTypes.splice(thisViewTypes.indexOf(view), 1);
        if (this.viewsByType.get(view.viewType).length === 0) {
            this.viewsByType.delete(view.viewType);
        }


        this.views.splice(this.views.indexOf(view), 1);
        this.selectedViews.indexOf(view) !== -1 && this.selectedViews.splice(this.selectedViews.indexOf(view), 1);
        view.dispose();
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
    }

    removeSelectedView(item: View) {
        item.tags.delete(ViewTag.Selected)
        this.selectedViews = without(this.selectedViews, item);

        this.hooks.forEach(hook => hook.removeSelectionHook([item]));
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

    static newInstance(): ViewStore {
        const viewStore = new ViewStore();
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
        this.registry.stores.objStore.removeObj(view.getObj());
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
            let axisView: MoveAxisView = <MoveAxisView> this.registry.services.viewService.createView(MoveAxisViewType);
            axisView.axis = CanvasAxis.X;
            axisView.setParent(views[0]);
            views[0].addChild(axisView);

            axisView = <MoveAxisView> this.registry.services.viewService.createView(MoveAxisViewType);
            axisView.axis = CanvasAxis.Y;
            axisView.setParent(views[0]);
            views[0].addChild(axisView);

            axisView = <MoveAxisView> this.registry.services.viewService.createView(MoveAxisViewType);
            axisView.axis = CanvasAxis.Z;
            axisView.setParent(views[0]);
            views[0].addChild(axisView);

            let scaleView: ScaleAxisView = <ScaleAxisView> this.registry.services.viewService.createView(ScaleAxisViewType);
            scaleView.axis = CanvasAxis.X;
            scaleView.setParent(views[0]);
            views[0].addChild(scaleView);

            scaleView = <ScaleAxisView> this.registry.services.viewService.createView(ScaleAxisViewType);
            scaleView.axis = CanvasAxis.Y;
            scaleView.setParent(views[0]);
            views[0].addChild(scaleView);

            scaleView = <ScaleAxisView> this.registry.services.viewService.createView(ScaleAxisViewType);
            scaleView.axis = CanvasAxis.Z;
            scaleView.setParent(views[0]);
            views[0].addChild(scaleView);
        }
    }

    removeSelectionHook(views: View[]) {
        views.forEach(view => {
            view.children.filter(view => view.viewType === MoveAxisViewType).forEach(child => view.deleteChild(child));
            view.children.filter(view => view.viewType === ScaleAxisViewType).forEach(child => view.deleteChild(child));
        });
    }
}
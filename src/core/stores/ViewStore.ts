import { View, ViewTag } from "../models/views/View";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { Polygon } from "../../utils/geometry/shapes/Polygon";
import { IdGenerator } from "./IdGenerator";
import { without } from "../../utils/geometry/Functions";
import { AbstractViewStoreHook } from "./AbstractViewStoreHook";

export function getIntersectingViews(store: ViewStore, rectangle: Rectangle): View[] {
    const x = rectangle.topLeft.x;
    const y = rectangle.topLeft.y;
    const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
    const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

    const polygon = Polygon.createRectangle(x, y, width, height);

    return store.getAllViews().filter(item => polygon.contains(item.getBounds()));
}

export class ViewStore {
    protected views: View[] = [];
    private selectedViews: View[] = [];
    protected idMap: Map<string, View> = new Map();
    private viewsByType: Map<string, View[]> = new Map();
    protected idGenerator: IdGenerator;
    private hooks: AbstractViewStoreHook[] = [];

    id: string;

    constructor(id: string) {
        this.id = id;
    }

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    addHook(hook: AbstractViewStoreHook) {
        this.hooks.push(hook);
    }

    removeHook(hook: AbstractViewStoreHook) {
        this.hooks.splice(this.hooks.indexOf(hook), 1);
    }

    addView(view: View) {
        if (view.id) {
            this.idGenerator.registerExistingIdForPrefix(view.viewType, view.id);
        } else {
            view.id = this.idGenerator.generateId(view.viewType);
        }
        view.getObj().id = view.id;

        this.views.push(view);
        this.idMap.set(view.id, view);

        if (!this.viewsByType.get(view.viewType)) {
            this.viewsByType.set(view.viewType, []);
        }

        this.viewsByType.get(view.viewType).push(view);
        
        this.hooks.forEach(hook => hook.addViewHook(view));
    }

    removeView(view: View) {
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

    getById(id: string): View {
        return this.idMap.get(id);
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
    }

    removeSelectedView(item: View) {
        item.tags.delete(ViewTag.Selected)
        this.selectedViews = without(this.selectedViews, item);
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
        this.selectedViews.forEach(item => item.tags.delete(ViewTag.Selected));
        this.selectedViews = [];
    }

    clear() {
        while(this.views.length > 0) {
            this.removeView(this.views[0]);
        }
        this.idMap = new Map();
        this.viewsByType = new Map();
        this.idGenerator.clear();
        this.clearSelection();
    }
}
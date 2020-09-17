import { AbstractStore } from "./AbstractStore";
import { View, ViewTag } from "../models/views/View";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { Polygon } from "../../utils/geometry/shapes/Polygon";
import { IdGenerator } from "./IdGenerator";
import { without } from "../../utils/geometry/Functions";

export class AbstractViewStore<T extends View> extends AbstractStore<T> {
    protected views: View[] = [];
    private selectedViews: View[] = [];
    protected idMap: Map<string, View> = new Map();
    protected idGenerator: IdGenerator;

    private addViewListeners: ((view: View) => void)[] = [];
    private removeViewListeners: ((view: View) => void)[] = [];

    constructor(id: string) {
        super();
        this.id = id;
    }

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    addView(view: View) {
        if (view.id) {
            this.idGenerator.registerExistingIdForPrefix(view.viewType, view.id);
        } else {
            view.id = this.idGenerator.generateId(view.viewType);
        }
        view.obj.id = view.id;

        this.views.push(view);
        this.idMap.set(view.id, view);
        this.addViewListeners.forEach(listener => listener(view));
    }

    onAddView(listener: (view: View) => void) {
        this.addViewListeners.push(listener);
    }

    removeView(view: View) {
        this.idGenerator.unregisterExistingIdForPrefix(view.viewType, view.id);

        this.removeViewListeners.forEach(listener => listener(view));

        this.idMap.delete(view.id);
        this.views.splice(this.views.indexOf(view), 1);
        this.selectedViews.indexOf(view) !== -1 && this.selectedViews.splice(this.selectedViews.indexOf(view), 1);
        view.dispose();
    }

    onRemoveView(listener: (view: View) => void) {
        this.removeViewListeners.push(listener);
    }

    getById(id: string): View {
        return this.idMap.get(id);
    }

    getViewsByType(type: string) {
        return this.views.filter(view => view.viewType === type);
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
    
    getIntersectingItemsInRect(rectangle: Rectangle): View[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }

    clear() {
        while(this.views.length > 0) {
            this.removeView(this.views[0]);
        }
        this.idMap = new Map();
        this.idGenerator.clear();
        this.clearSelection();
    }
}
import { AbstractStore } from "./AbstractStore";
import { View } from "../models/views/View";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { Polygon } from "../../utils/geometry/shapes/Polygon";
import { IdGenerator } from "./IdGenerator";

export class AbstractViewStore<T extends View> extends AbstractStore<T> {
    protected views: View[] = [];
    protected idMap: Map<string, View> = new Map();
    protected idGenerator: IdGenerator;

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    addItem(view: View) {
        if (view.id) {
            this.idGenerator.registerExistingIdForPrefix(view.viewType, view.id);
        } else {
            view.id = this.idGenerator.generateId(view.viewType);
            view.obj.id = view.id;
        }
        
        this.views.push(view);
        this.idMap.set(view.id, view);
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

    removeItem(view: View) {
        this.idGenerator.unregisterExistingIdForPrefix(view.viewType, view.id);

        this.idMap.delete(view.id);

        this.views.splice(this.views.indexOf(view), 1);
        view.dispose();
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
        this.views.forEach(view => view.dispose());
        this.views = [];
        this.idMap = new Map();
        this.idGenerator.clear();
    }
}
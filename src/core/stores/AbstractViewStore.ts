import { AbstractStore } from "./AbstractStore";
import { View } from "../models/views/View";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { Polygon } from "../../utils/geometry/shapes/Polygon";

export class AbstractViewStore<T extends View> extends AbstractStore<T> {
    protected views: View[] = [];

    addItem(item: View) {
        const pattern = this.createPattern(item.viewType);
        const num = parseInt(item.id.match(pattern)[1], 10);

        if (!this.prefixIndexCounter.has(item.viewType)) {
            this.prefixIndexCounter.set(item.viewType, num);
        }

        if (this.prefixIndexCounter.get(item.viewType) < num) {
            this.prefixIndexCounter.set(item.viewType, num);
        }
    }

    getViewsByType(type: string) {
        return this.views.filter(view => view.viewType === type);
    }

    removeItem(item: View) {
        const pattern = this.createPattern(item.viewType);
        const num = parseInt(item.id.match(pattern)[1], 10);

        const maxId = this.prefixIndexCounter.get(item.viewType);
        if (maxId > 0 && maxId === num) {
            this.prefixIndexCounter.set(item.viewType, maxId - 1);
        }
    }

    private createPattern(type: string) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
    
    getIntersectingItemsInRect(rectangle: Rectangle): View[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }
}
import { AbstractStore } from "./AbstractStore";
import { View } from "./views/View";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { Polygon } from "../../utils/geometry/shapes/Polygon";


export class AbstractViewStore extends AbstractStore {
    protected views: View[] = [];

    addItem(item: View) {
        const pattern = this.createPattern(item.viewType);
        const num = parseInt(item.id.match(pattern)[1], 10);

        if (!this.maxIdForType.has(item.viewType)) {
            this.maxIdForType.set(item.viewType, num);
        }

        if (this.maxIdForType.get(item.viewType) < num) {
            this.maxIdForType.set(item.viewType, num);
        }
    }

    removeItem(item: View) {
        const pattern = this.createPattern(item.viewType);
        const num = parseInt(item.id.match(pattern)[1], 10);

        const maxId = this.maxIdForType.get(item.viewType);
        if (maxId > 0 && maxId === num) {
            this.maxIdForType.set(item.viewType, maxId - 1);
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
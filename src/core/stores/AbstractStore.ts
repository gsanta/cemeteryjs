import { Polygon } from '../geometry/shapes/Polygon';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { View } from '../models/views/View';


export abstract class AbstractStore {
    protected maxIdForType: Map<string, number> = new Map();
    protected views: View[] = [];

    addItem(item: {type: string, id: string}) {
        const pattern = this.createPattern(item.type);
        const num = parseInt(item.id.match(pattern)[1], 10);

        if (!this.maxIdForType.has(item.type)) {
            this.maxIdForType.set(item.type, num);
        }

        if (this.maxIdForType.get(item.type) < num) {
            this.maxIdForType.set(item.type, num);
        }
    }

    removeItem(item: {type: string, id: string}) {
        const pattern = this.createPattern(item.type);
        const num = parseInt(item.id.match(pattern)[1], 10);

        const maxId = this.maxIdForType.get(item.type);
        if (maxId > 0 && maxId === num) {
            this.maxIdForType.set(item.type, maxId - 1);
        }
    }

    clear() {
        this.maxIdForType = new Map();
    }

    generateUniqueName(type: string) {
        const maxId = this.maxIdForType.get(type) || 0;
        const name = `${type}${maxId + 1}`.toLocaleLowerCase();
        return name;
    }

    getIntersectingItemsInRect(rectangle: Rectangle): View[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }

    private createPattern(type: string) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}
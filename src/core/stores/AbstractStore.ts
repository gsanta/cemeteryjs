import { maxBy } from '../geometry/utils/Functions';
import { ConceptType, View } from '../models/views/View';
import { FeedbackType } from '../models/views/control/IControl';
import { Hoverable } from '../models/Hoverable';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { VisualConcept } from '../models/concepts/VisualConcept';
import { Polygon } from '../geometry/shapes/Polygon';


export abstract class AbstractStore {
    protected views: VisualConcept[] = [];
    protected abstract getItemsByType(type: string): Hoverable[];
    abstract removeItemById(id: string);

    generateUniqueName(type: string) {
        const name = `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
        return name;
    }

    getIntersectingItemsInRect(rectangle: Rectangle): VisualConcept[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }

    private getMaxIndex(type: string): number {
        const pattern = this.createPattern(type);
        const views = this.getItemsByType(type).filter(view => view.id.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<View>(views, (a, b) => parseInt(a.id.match(pattern)[1], 10) - parseInt(b.id.match(pattern)[1], 10));
            return parseInt(max.id.match(pattern)[1], 10);
        }

    }

    private createPattern(type: string) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}
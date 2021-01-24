import { without } from "../../utils/geometry/Functions";
import { AbstractShape, ShapeTag } from '../models/views/AbstractShape';

export class SelectionStore {
    items: AbstractShape[] = [];

    addSelectedView(...items: AbstractShape[]) {
        items.forEach(item => item.tags.add(ShapeTag.Selected));
        this.items.push(...items);
    }

    removeSelectedView(item: AbstractShape) {
        item.tags.delete(ShapeTag.Selected)
        this.items = without(this.items, item);
    }

    getSelectedViews(): AbstractShape[] {
        return this.items;
    }

    getSelectedViewsByType(type: string): AbstractShape[] {
        return this.items.filter(view => view.viewType === type);
    }

    getOneSelectedView(): AbstractShape {
        return this.items.length > 0 && this.items[0];
    }

    clearSelection() {
        this.items.forEach(item => item.tags.delete(ShapeTag.Selected));
        this.items = [];
    }
}
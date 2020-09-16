import { without } from "../../utils/geometry/Functions";
import { View, ViewTag } from '../models/views/View';

export class SelectionStore {
    items: View[] = [];

    addSelectedView(...items: View[]) {
        items.forEach(item => item.tags.add(ViewTag.Selected));
        this.items.push(...items);
    }

    removeSelectedView(item: View) {
        item.tags.delete(ViewTag.Selected)
        this.items = without(this.items, item);
    }

    getSelectedViews(): View[] {
        return this.items;
    }

    getSelectedViewsByType(type: string): View[] {
        return this.items.filter(view => view.viewType === type);
    }

    getOneSelectedView(): View {
        return this.items.length > 0 && this.items[0];
    }

    clearSelection() {
        this.items.forEach(item => item.tags.delete(ViewTag.Selected));
        this.items = [];
    }
}
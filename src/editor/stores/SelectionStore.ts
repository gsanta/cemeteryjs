import { CanvasItem } from "../views/canvas/models/CanvasItem";import { without } from "../../misc/geometry/utils/Functions";


export class SelectionStore {
    items: CanvasItem[] = [];

    addItem(item: CanvasItem) {
        this.items.push(item);
    }

    removeItem(item: CanvasItem) {
        this.items = without(this.items, item);
    }
}
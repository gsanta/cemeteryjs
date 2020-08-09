import { without } from "../geometry/utils/Functions";
import { PathView } from "../models/views/PathView";
import { FeedbackType } from "../models/views/child_views/ChildView";
import { EditPointView } from "../models/views/child_views/EditPointView";
import { View, ViewType, ViewTag } from '../models/views/View';
import { isView } from "./SceneStore";

export class SelectionStore {
    items: View[] = [];

    addItem(...items: View[]) {
        items.forEach(item => item.tags.add(ViewTag.Selected));
        this.items.push(...items);
    }

    removeItem(item: View) {
        item.tags.delete(ViewTag.Selected)
        this.items = without(this.items, item);
    }

    contains(item: View): boolean {
        return this.items.includes(item);
    }

    getAll(): View[] {
        return this.items;
    }

    getAllViews(): View[] {
        return <View[]> this.items.filter(item => isView(item.viewType));
    }

    getPathViews(): PathView[] {
        return <PathView[]> this.items.filter(view => view.viewType === ViewType.PathView);
    }

    hasOne(): boolean {
        return this.items.length === 1;
    }

    hasAny(): boolean {
        return this.items.length > 0;
    }

    getOneByType(viewType: ViewType): View {
        return this.items.find(item => item.viewType === viewType);
    }

    getView(): View {
        return this.items.length > 0 && this.items[0];
    }

    getEditPoint(): EditPointView {
        return <EditPointView> this.items.find(item => item.viewType === FeedbackType.EditPointFeedback);
    }

    hasEditPoint() {
        return this.getEditPoint() !== undefined;
    }

    clear() {
        this.items.forEach(item => item.tags.delete(ViewTag.Selected));
        this.items = [];
    }
}
import { without } from "../geometry/utils/Functions";
import { PathView } from "../models/views/PathView";
import { ChildView, FeedbackType } from "../models/views/child_views/ChildView";
import { EditPointView } from "../models/views/child_views/EditPointView";
import { View, ViewType } from "../models/views/View";
import { isView } from "./SceneStore";

export class SelectionStore {
    items: View[] = [];

    addItem(...item: View[]) {
        this.items.push(...item);
    }

    removeItem(item: View) {
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

    hasAny(): boolean {
        return this.items.length > 0;
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
        this.items = [];
    }
}
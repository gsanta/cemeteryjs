import { without } from "../geometry/utils/Functions";
import { PathView } from "../models/views/PathView";
import { ChildView, FeedbackType } from "../models/views/child_views/ChildView";
import { EditPointView } from "../models/views/child_views/EditPointView";
import { View, ViewType } from "../models/views/View";

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

    getAllConcepts(): View[] {
        return <View[]> this.items.filter(item => item.viewType.endsWith('Concept'));
    }

    getPathConcepts(): PathView[] {
        return <PathView[]> this.items.filter(view => view.viewType === ViewType.PathView);
    }

    hasConcept(): boolean {
        return this.getConcept() !== undefined;
    }

    hasFeedback(): boolean {
        return this.getFeedback() !== undefined;
    }

    hasAny(): boolean {
        return this.items.length > 0;
    }

    getConcept(): View {
        return <View> this.items.find(item => item.viewType.endsWith('Concept'));
    }

    getFeedback(): ChildView<any> {
        return <ChildView<any>> this.items.find(item => item.viewType.endsWith('Feedback'));
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
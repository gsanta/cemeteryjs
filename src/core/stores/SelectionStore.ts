import { without } from "../geometry/utils/Functions";
import { PathView } from "../models/views/PathView";
import { ChildView, FeedbackType } from "../models/views/child_views/ChildView";
import { EditPointView } from "../models/views/child_views/EditPointView";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { View, ConceptType } from "../models/views/View";

export class SelectionStore {
    items: View[] = [];

    addItem(...item: VisualConcept[]) {
        this.items.push(...item);
    }

    removeItem(item: VisualConcept) {
        this.items = without(this.items, item);
    }

    contains(item: VisualConcept): boolean {
        return this.items.includes(item);
    }

    getAll(): View[] {
        return this.items;
    }

    getAllConcepts(): VisualConcept[] {
        return <VisualConcept[]> this.items.filter(item => item.type.endsWith('Concept'));
    }

    getPathConcepts(): PathView[] {
        return <PathView[]> this.items.filter(view => view.type === ConceptType.PathConcept);
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
        return <View> this.items.find(item => item.type.endsWith('Concept'));
    }

    getFeedback(): ChildView<any> {
        return <ChildView<any>> this.items.find(item => item.type.endsWith('Feedback'));
    }

    getEditPoint(): EditPointView {
        return <EditPointView> this.items.find(item => item.type === FeedbackType.EditPointFeedback);
    }

    hasEditPoint() {
        return this.getEditPoint() !== undefined;
    }

    clear() {
        this.items = [];
    }
}
import { without } from "../geometry/utils/Functions";
import { PathView } from "../models/views/PathView";
import { IControl, FeedbackType } from "../models/views/control/IControl";
import { EditPointView } from "../models/views/control/EditPointView";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { View, ConceptType } from "../models/views/View";
import { Hoverable } from "../models/Hoverable";


export class SelectionStore {
    items: Hoverable[] = [];

    addItem(...item: Hoverable[]) {
        this.items.push(...item);
    }

    removeItem(item: Hoverable) {
        this.items = without(this.items, item);
    }

    contains(item: Hoverable): boolean {
        return this.items.includes(item);
    }

    getAll(): Hoverable[] {
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

    getFeedback(): IControl<any> {
        return <IControl<any>> this.items.find(item => item.type.endsWith('Feedback'));
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
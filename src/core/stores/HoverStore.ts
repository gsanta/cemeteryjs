import { without } from "../geometry/utils/Functions";
import { PathConcept } from "../models/concepts/PathConcept";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { EditPoint } from "../models/feedbacks/EditPoint";
import { IControl, FeedbackType } from "../models/controls/IControl";
import { isFeedback } from "./CanvasStore";
import { ConceptType } from "../models/concepts/Concept";
import { Hoverable } from "../models/Hoverable";

export class HoverStore {
    items: Hoverable[] = [];

    addItem(item: Hoverable) {
        this.items.push(item);
    }

    removeItem(item: Hoverable) {
        this.items = without(this.items, item);
    }

    contains(item: Hoverable): boolean {
        return this.items.includes(item);
    }
    
    getEditPoint(): EditPoint {
        return <EditPoint> this.items.find(item => item.type === FeedbackType.EditPointFeedback);
    }

    hasEditPoint() {
        return this.getEditPoint() !== undefined;
    }

    hasFeedback(): boolean {
        return this.getFeedback() !== undefined;
    }

    hasAny(): boolean {
        return this.getAny() !== undefined;
    }

    getAny(): Hoverable {
        return this.items.length > 0 ? this.items[0] : undefined;
    }

    getConcept(): VisualConcept {
        return <VisualConcept> this.items.find(item => item.type.endsWith('Concept'));
    }
    
    hasConcept(): boolean {
        return this.getConcept() !== undefined;
    }

    getFeedback(): IControl<any> {
        return <IControl<any>> this.items.find(item => item.type.endsWith('Feedback'));
    }

    hasPath(): boolean {
        return this.getPath() !== undefined;
    }

    getPath(): PathConcept {
        return <PathConcept> this.items.find(item => item.type === ConceptType.PathConcept);
    }

    hasEditPointOf(conceptType: ConceptType) {
        return this.getEditPointOf(conceptType) !== undefined;
    }

    getEditPointOf(conceptType: ConceptType) {
        return this.items.find(item =>  isFeedback(item.type) && (<IControl<any>> item).parent.type === conceptType);
    }

    clear() {
        this.items = [];
    }
}
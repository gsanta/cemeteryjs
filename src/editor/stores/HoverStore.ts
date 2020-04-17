import { without } from "../../misc/geometry/utils/Functions";
import { Concept, ConceptType } from "../views/canvas/models/concepts/Concept";
import { Feedback, FeedbackType } from "../views/canvas/models/feedbacks/Feedback";
import { EditPoint } from "../views/canvas/models/feedbacks/EditPoint";
import { VisualConcept } from "../views/canvas/models/concepts/VisualConcept";
import { PathConcept } from "../views/canvas/models/concepts/PathConcept";
import { isFeedback } from "./CanvasStore";

export class HoverStore {
    items: (VisualConcept | Feedback)[] = [];

    addItem(item: VisualConcept | Feedback) {
        this.items.push(item);
    }

    removeItem(item: VisualConcept | Feedback) {
        this.items = without(this.items, item);
    }

    contains(item: VisualConcept | Feedback): boolean {
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

    getAny(): VisualConcept | Feedback {
        return this.items.length > 0 ? this.items[0] : undefined;
    }

    getConcept(): VisualConcept {
        return <VisualConcept> this.items.find(item => item.type.endsWith('Concept'));
    }
    
    hasConcept(): boolean {
        return this.getConcept() !== undefined;
    }

    getFeedback(): Feedback {
        return <Feedback> this.items.find(item => item.type.endsWith('Feedback'));
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
        return this.items.find(item =>  isFeedback(item.type) && (<Feedback> item).parent.type === conceptType);
    }

    clear() {
        this.items = [];
    }
}
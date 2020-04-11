import { without } from "../../misc/geometry/utils/Functions";
import { Concept } from "../views/canvas/models/concepts/Concept";
import { Feedback, FeedbackType } from "../views/canvas/models/feedbacks/Feedback";
import { EditPoint } from "../views/canvas/models/feedbacks/EditPoint";

export class HoverStore {
    items: (Concept | Feedback)[] = [];

    addItem(item: Concept | Feedback) {
        this.items.push(item);
    }

    removeItem(item: Concept | Feedback) {
        this.items = without(this.items, item);
    }

    contains(item: Concept | Feedback): boolean {
        return this.items.includes(item);
    }
    
    getEditPoint(): EditPoint {
        return <EditPoint> this.items.find(item => item.type === FeedbackType.EditPointFeedback);
    }

    hasEditPoint() {
        return this.getEditPoint() !== undefined;
    }

    hasConcept(): boolean {
        return this.getConcept() !== undefined;
    }

    hasFeedback(): boolean {
        return this.getFeedback() !== undefined;
    }

    hasAny(): boolean {
        return this.getAny() !== undefined;
    }

    getAny(): Concept | Feedback {
        return this.items.length > 0 ? this.items[0] : undefined;
    }

    getConcept(): Concept {
        return <Concept> this.items.find(item => item.type.endsWith('Concept'));
    }

    getFeedback(): Feedback {
        return <Feedback> this.items.find(item => item.type.endsWith('Feedback'));
    }

    clear() {
        this.items = [];
    }
}
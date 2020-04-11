import { without } from "../../misc/geometry/utils/Functions";
import { Concept, ConceptType } from "../views/canvas/models/concepts/Concept";
import { PathConcept } from "../views/canvas/models/concepts/PathConcept";
import { Feedback, FeedbackType } from "../views/canvas/models/feedbacks/Feedback";
import { EditPoint } from "../views/canvas/models/feedbacks/EditPoint";


export class SelectionStore {
    items: (Concept | Feedback)[] = [];

    addItem(...item: (Concept | Feedback)[]) {
        this.items.push(...item);
    }

    removeItem(item: Concept | Feedback) {
        this.items = without(this.items, item);
    }

    contains(item: Concept | Feedback): boolean {
        return this.items.includes(item);
    }

    getAll(): (Concept | Feedback)[] {
        return this.items;
    }

    getAllConcepts(): Concept[] {
        return <Concept[]> this.items.filter(item => item.type.endsWith('Concept'));
    }

    getPathConcepts(): PathConcept[] {
        return <PathConcept[]> this.items.filter(view => view.type === ConceptType.PathConcept);
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

    getConcept(): Concept {
        return <Concept> this.items.find(item => item.type.endsWith('Concept'));
    }

    getFeedback(): Feedback {
        return <Feedback> this.items.find(item => item.type.endsWith('Feedback'));
    }

    getEditPoint(): EditPoint {
        return <EditPoint> this.items.find(item => item.type === FeedbackType.EditPointFeedback);
    }

    hasEditPoint() {
        return this.getEditPoint() !== undefined;
    }

    clear() {
        this.items = [];
    }
}
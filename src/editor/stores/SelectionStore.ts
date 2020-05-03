import { without } from "../../misc/geometry/utils/Functions";
import { Concept, ConceptType } from "../models/concepts/Concept";
import { PathConcept } from "../models/concepts/PathConcept";
import { Feedback, FeedbackType } from "../models/feedbacks/Feedback";
import { EditPoint } from "../models/feedbacks/EditPoint";
import { VisualConcept } from "../models/concepts/VisualConcept";


export class SelectionStore {
    items: (VisualConcept | Feedback)[] = [];

    addItem(...item: (VisualConcept | Feedback)[]) {
        this.items.push(...item);
    }

    removeItem(item: VisualConcept | Feedback) {
        this.items = without(this.items, item);
    }

    contains(item: VisualConcept | Feedback): boolean {
        return this.items.includes(item);
    }

    getAll(): (Concept | Feedback)[] {
        return this.items;
    }

    getAllConcepts(): VisualConcept[] {
        return <VisualConcept[]> this.items.filter(item => item.type.endsWith('Concept'));
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
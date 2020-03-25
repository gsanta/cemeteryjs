import { CanvasItem, CanvasItemType } from "../views/canvas/models/CanvasItem";import { without } from "../../misc/geometry/utils/Functions";
import { Concept } from "../views/canvas/models/concepts/Concept";
import { PathConcept } from "../views/canvas/models/concepts/PathConcept";
import { Feedback } from "../views/canvas/models/feedbacks/Feedback";
import { EditPoint } from "../views/canvas/models/feedbacks/EditPoint";


export class SelectionStore {
    items: CanvasItem[] = [];

    addItem(...item: CanvasItem[]) {
        this.items.push(...item);
    }

    removeItem(item: CanvasItem) {
        this.items = without(this.items, item);
    }

    contains(item: CanvasItem): boolean {
        return this.items.includes(item);
    }

    getAll(): CanvasItem[] {
        return this.items;
    }

    getAllConcepts(): Concept[] {
        return <Concept[]> this.items.filter(item => item.type.endsWith('Concept'));
    }

    getPathConcepts(): PathConcept[] {
        return <PathConcept[]> this.items.filter(view => view.type === CanvasItemType.PathConcept);
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
        return <EditPoint> this.items.find(item => item.type === CanvasItemType.EditPointFeedback);
    }

    hasEditPoint() {
        return this.getEditPoint() !== undefined;
    }

    clear() {
        this.items = [];
    }
}
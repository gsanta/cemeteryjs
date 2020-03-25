import { CanvasItem, CanvasItemType } from "../views/canvas/models/CanvasItem";
import { without } from "../../misc/geometry/utils/Functions";
import { Concept } from "../views/canvas/models/concepts/Concept";
import { Feedback } from "../views/canvas/models/feedbacks/Feedback";
import { EditPoint } from "../views/canvas/models/feedbacks/EditPoint";

export class HoverStore {
    items: CanvasItem[] = [];

    addItem(item: CanvasItem) {
        this.items.push(item);
    }

    removeItem(item: CanvasItem) {
        this.items = without(this.items, item);
    }

    contains(item: CanvasItem): boolean {
        return this.items.includes(item);
    }
    
    getEditPoint(): EditPoint {
        return <EditPoint> this.items.find(item => item.type === CanvasItemType.EditPointFeedback);
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

    getAny(): CanvasItem {
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
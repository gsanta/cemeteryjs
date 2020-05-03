import { Point } from "../../../misc/geometry/shapes/Point";
import { VisualConcept } from "../concepts/VisualConcept";
import { Feedback, FeedbackType } from "./Feedback";

export class EditPoint implements Feedback {
    type = FeedbackType.EditPointFeedback;
    point: Point;
    parent: VisualConcept;

    constructor(point: Point, parent: VisualConcept) {
        this.point = point;
        this.parent = parent;
    }

    toString() {
        return `EditPoint: ${this.parent.id} ${this.point.toString()}`
    }
}
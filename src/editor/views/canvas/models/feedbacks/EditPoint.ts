import { Point } from "../../../../../misc/geometry/shapes/Point";
import { Concept } from "../concepts/Concept";
import { Feedback, FeedbackType } from "./Feedback";

export class EditPoint implements Feedback {
    type = FeedbackType.EditPointFeedback;
    point: Point;
    parent: Concept;

    constructor(point: Point, parent: Concept) {
        this.point = point;
        this.parent = parent;
    }
}
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { Concept } from "../concepts/Concept";
import { Feedback } from "./Feedback";
import { CanvasItemType } from "../CanvasItem";

export class EditPoint implements Feedback {
    type = CanvasItemType.EditPointFeedback;
    point: Point;
    parent: Concept;

    constructor(point: Point, parent: Concept) {
        this.point = point;
        this.parent = parent;
    }
}
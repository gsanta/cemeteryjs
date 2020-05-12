import { Point } from "../../geometry/shapes/Point";
import { VisualConcept } from "../concepts/VisualConcept";
import { IControl, FeedbackType } from "../controls/IControl";
import { PathConcept } from "../concepts/PathConcept";

export class EditPoint implements IControl<PathConcept> {
    type = FeedbackType.EditPointFeedback;
    point: Point;
    parent: PathConcept;

    constructor(point: Point, parent: PathConcept) {
        this.point = point;
        this.parent = parent;
    }

    toString() {
        return `EditPoint: ${this.parent.id} ${this.point.toString()}`
    }
}
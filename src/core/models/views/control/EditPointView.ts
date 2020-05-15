import { Point } from "../../../geometry/shapes/Point";
import { IControl, FeedbackType } from "./IControl";
import { PathView } from "../PathView";

export class EditPointView implements IControl<PathView> {
    id: string;
    type = FeedbackType.EditPointFeedback;
    point: Point;
    parent: PathView;

    constructor(id: string, point: Point, parent: PathView) {
        this.id = id;
        this.point = point;
        this.parent = parent;
    }

    delete() {
        this.parent.deleteEditPoint(this);
    }

    move(delta: Point) {
        this.parent.moveEditPoint(this, delta);
    }

    toString() {
        return `EditPoint: ${this.parent.id} ${this.point.toString()}`
    }
}
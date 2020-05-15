import { Point } from "../../geometry/shapes/Point";
import { IControl, FeedbackType } from "../controls/IControl";
import { PathView } from "../views/PathView";

export class EditPoint implements IControl<PathView> {
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
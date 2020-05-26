import { Point } from "../../../geometry/shapes/Point";
import { ChildView, FeedbackType } from "./ChildView";
import { PathView } from "../PathView";
import { View } from "../View";

export class EditPointView extends ChildView<PathView> {
    id: string;
    type = FeedbackType.EditPointFeedback;
    point: Point;
    parent: PathView;

    constructor(id: string, point: Point, parent: PathView) {
        super();
        this.id = id;
        this.point = point;
        this.parent = parent;
    }

    delete(): View[] {
        this.parent.deleteEditPoint(this);
        return [this];
    }

    move(delta: Point) {
        this.parent.moveEditPoint(this, delta);
    }

    toString() {
        return `EditPoint: ${this.parent.id} ${this.point.toString()}`
    }
}
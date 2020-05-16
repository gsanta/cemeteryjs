import { Point } from "../../../geometry/shapes/Point";
import { IControl, FeedbackType } from "./IControl";
import { PathView } from "../PathView";
import { VisualConcept } from "../../concepts/VisualConcept";

export class EditPointView extends IControl<PathView> {
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

    delete(): VisualConcept[] {
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
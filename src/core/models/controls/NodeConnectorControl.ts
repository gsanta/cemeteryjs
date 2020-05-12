import { Point } from "../../geometry/shapes/Point";
import { ActionNodeConcept } from "../concepts/ActionNodeConcept";
import { FeedbackType, IControl } from "./IControl";

export class NodeConnectorControl implements IControl<ActionNodeConcept> {
    type = FeedbackType.NodeConnectorFeedback;
    point: Point;
    parent: ActionNodeConcept;
    other: ActionNodeConcept;

    constructor(point: Point, parent: ActionNodeConcept) {
        this.point = point;
        this.parent = parent;
    }

    delete() {}
    move(delta: Point) {}

    toString() {
        return `${this.type}: ${this.parent.id} ${this.point.toString()}`
    }
}
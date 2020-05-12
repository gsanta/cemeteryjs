import { Point } from "../../geometry/shapes/Point";
import { ActionNodeConcept } from "../concepts/ActionNodeConcept";
import { FeedbackType, IControl } from "./IControl";
import { Hoverable } from "../Hoverable";

export function isNodeConnectionControl(hoverable: Hoverable) {
    return hoverable && hoverable.type === FeedbackType.NodeConnectorFeedback;
}

export class NodeConnectionControl implements IControl<ActionNodeConcept> {
    type = FeedbackType.NodeConnectorFeedback;
    point: Point;
    parent: ActionNodeConcept;
    other: ActionNodeConcept;

    constructor(parent: ActionNodeConcept) {
        this.parent = parent;
    }

    delete() {}
    move(delta: Point) {}

    toString() {
        return `${this.type}: ${this.parent.id} ${this.point.toString()}`
    }
}
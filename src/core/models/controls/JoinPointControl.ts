import { Point } from "../../geometry/shapes/Point";
import { NodeView } from "../views/NodeView";
import { FeedbackType, IControl } from "./IControl";
import { Hoverable } from "../Hoverable";

export function isNodeConnectionControl(hoverable: Hoverable) {
    return hoverable && hoverable.type === FeedbackType.NodeConnectorFeedback;
}

export class JoinPointControl implements IControl<NodeView> {
    type = FeedbackType.NodeConnectorFeedback;
    id: string;
    point: Point;
    parent: NodeView;
    other: NodeView;

    constructor(parent: NodeView, slotIndex: number, isInput: boolean) {
        this.parent = parent;
        this.initPosition(slotIndex, isInput);
    }

    private initPosition(slotIndex: number, isInput: boolean) {
        const yStart = this.parent.dimensions.topLeft.y + 50;
        const x = isInput ? this.parent.dimensions.topLeft.x : this.parent.dimensions.bottomRight.x;

        const y = slotIndex * 20 + yStart;
        this.point = new Point(x, y);
    }

    delete() {}
    move(delta: Point) {
        this.point = this.point.add(delta);
    }

    toString() {
        return `${this.type}: ${this.parent.id} ${this.point.toString()}`
    }
}
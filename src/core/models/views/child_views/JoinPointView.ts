import { Point } from "../../../geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { FeedbackType, ChildView } from "./ChildView";
import { Hoverable } from "../../Hoverable";
import { NodeConnectionView } from "../NodeConnectionView";
import { ConnectionSlot } from "../nodes/AbstractNode";

export function isNodeConnectionControl(hoverable: Hoverable) {
    return hoverable && hoverable.type === FeedbackType.NodeConnectorFeedback;
}

export class JoinPointView extends ChildView<NodeView> {
    type = FeedbackType.NodeConnectorFeedback;
    id: string;
    point: Point;
    parent: NodeView;
    connection: NodeConnectionView;

    constructor(parent: NodeView, slot: ConnectionSlot, isInput: boolean) {
        super();
        this.parent = parent;
        this.initPosition(slot, isInput);
    }

    private initPosition(slot: ConnectionSlot, isInput: boolean) {
        const yStart = this.parent.dimensions.topLeft.y + 50;
        const x = isInput ? this.parent.dimensions.topLeft.x : this.parent.dimensions.bottomRight.x;
        const slotIndex = isInput ? this.parent.data.inputSlots.indexOf(slot) : this.parent.data.outputSlots.indexOf(slot);
        const y = slotIndex * 20 + yStart;
        this.point = new Point(x, y);
    }

    move(delta: Point) {
        this.point = this.point.add(delta);
        this.connection.updateDimensions();
    }

    toString() {
        return `${this.type}: ${this.parent.id} ${this.point.toString()}`;
    }
}
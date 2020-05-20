import { Point } from "../../../geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { FeedbackType, ChildView } from "./ChildView";
import { Hoverable } from "../../Hoverable";
import { NodeConnectionView } from "../NodeConnectionView";
import { sizes } from "../../../gui/styles";

export function isNodeConnectionControl(hoverable: Hoverable) {
    return hoverable && hoverable.type === FeedbackType.NodeConnectorFeedback;
}

export class JoinPointView extends ChildView<NodeView> {
    type = FeedbackType.NodeConnectorFeedback;
    id: string;
    point: Point;
    parent: NodeView;
    connection: NodeConnectionView;
    slotName: string;
    isInput: boolean;

    constructor(parent: NodeView, slotName: string, isInput: boolean) {
        super();
        this.parent = parent;
        this.slotName = slotName;
        this.isInput = isInput;
        this.initPosition(slotName, isInput);
    }

    getOtherNode() {
        if (!this.connection) { return; }
        return this.connection.joinPoint1 === this ? this.connection.joinPoint2.parent : this.connection.joinPoint1.parent;
    }

    private initPosition(slotName: string, isInput: boolean) {
        const yStart = this.parent.dimensions.topLeft.y + sizes.nodes.headerHeight;
        const x = isInput ? this.parent.dimensions.topLeft.x : this.parent.dimensions.bottomRight.x;
        const slotIndex = isInput ? this.parent.model.inputSlots.findIndex(slot => slot.name === slotName) : this.parent.model.outputSlots.findIndex(slot => slot.name === slotName);
        const y = slotIndex * sizes.nodes.slotHeight + sizes.nodes.slotHeight / 2 + yStart;
        this.point = new Point(x, y);
    }

    move(delta: Point) {
        this.point = this.point.add(delta);
        this.connection && this.connection.updateDimensions();
    }

    delete() {
        if (this.connection) {
            const ret = [this, this.connection];
            this.connection.delete();
            return ret;
        }

        return [this];
    }

    toString() {
        return `${this.type}: ${this.parent.id} ${this.point.toString()}`;
    }
}
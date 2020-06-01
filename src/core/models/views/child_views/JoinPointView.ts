import { Point } from "../../../geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { FeedbackType, ChildView } from "./ChildView";
import { NodeConnectionView } from "../NodeConnectionView";
import { sizes } from "../../../gui/styles";
import { View, ViewJson } from "../View";
import { Rectangle } from "../../../geometry/shapes/Rectangle";

export function isJoinPointView(view: View) {
    return view && view.type === FeedbackType.NodeConnectorFeedback;
}

export interface JoinPointViewJson extends ViewJson {
    point: string;
    slotName: string;
    isInput: boolean;
}

export class JoinPointView extends ChildView<NodeView> {
    type = FeedbackType.NodeConnectorFeedback;
    id: string;
    point: Point;
    parent: NodeView;
    connection: NodeConnectionView;
    slotName: string;
    isInput: boolean;
    dimensions: Rectangle;

    constructor(parent: NodeView, config?: {slotName: string, isInput: boolean}) {
        super();
        this.parent = parent;

        if (config) {
            this.slotName = config.slotName;
            this.isInput = config.isInput;
            this.initPosition();
        }
    }

    getOtherNode() {
        if (!this.connection) { return; }
        return this.connection.joinPoint1 === this ? this.connection.joinPoint2.parent : this.connection.joinPoint1.parent;
    }

    private initPosition() {
        const yStart = this.parent.dimensions.topLeft.y + sizes.nodes.headerHeight;
        const x = this.isInput ? this.parent.dimensions.topLeft.x : this.parent.dimensions.bottomRight.x;
        const slotIndex = this.isInput ? this.parent.model.inputSlots.findIndex(slot => slot.name === this.slotName) : this.parent.model.outputSlots.findIndex(slot => slot.name === this.slotName);
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

    toJson(): JoinPointViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            slotName: this.slotName,
            isInput: this.isInput
        }
    }

    fromJson(json: JoinPointViewJson) {
        super.fromJson(json);
        this.point = Point.fromString(json.point);
        this.slotName = json.slotName;
        this.isInput = json.isInput;
        this.initPosition();
    }
}
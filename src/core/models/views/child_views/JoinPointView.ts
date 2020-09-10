import { Point } from "../../../../utils/geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { FeedbackType, ChildView } from "./ChildView";
import { NodeConnectionView } from "../NodeConnectionView";
import { sizes } from "../../../ui_components/react/styles";
import { View, ViewJson } from "../View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";

export function isJoinPointView(view: View) {
    return view && view.viewType === FeedbackType.NodeConnectorFeedback;
}

export interface JoinPointViewJson extends ViewJson {
    point: string;
    slotName: string;
    isInput: boolean;
}

export class JoinPointView extends ChildView<NodeView> {
    viewType = FeedbackType.NodeConnectorFeedback;
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

    private initPosition() {
        const yStart = this.parent.dimensions.topLeft.y + sizes.nodes.headerHeight;
        const x = this.isInput ? 0 : this.parent.dimensions.getWidth(); // this.parent.dimensions.topLeft.x : this.parent.dimensions.bottomRight.x;
        const slotIndex = this.isInput ? this.parent.obj.inputs.findIndex(slot => slot.name === this.slotName) : this.parent.obj.outputs.findIndex(slot => slot.name === this.slotName);
        const y = slotIndex * sizes.nodes.slotHeight + sizes.nodes.slotHeight / 2 + sizes.nodes.headerHeight;
        this.point = new Point(x, y);

        this.dimensions = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
    }

    getAbsolutePosition() {
        return new Point(this.parent.dimensions.topLeft.x + this.point.x, this.parent.dimensions.topLeft.y + this.point.y); 
    }

    move(delta: Point) {
        if (this.connection) {
            this.isInput ? this.connection.setPoint1(this.getAbsolutePosition()) : this.connection.setPoint2(this.getAbsolutePosition());
        }
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
        return `${this.viewType}: ${this.parent.id} ${this.point.toString()}`;
    }

    toJson(): JoinPointViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            slotName: this.slotName,
            isInput: this.isInput
        }
    }

    fromJson(json: JoinPointViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.point = Point.fromString(json.point);
        this.slotName = json.slotName;
        this.isInput = json.isInput;
        this.initPosition();
    }
}
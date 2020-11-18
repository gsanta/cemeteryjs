import { Point } from "../../../../utils/geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { ContainedView } from "./ChildView";
import { NodeConnectionView } from "../NodeConnectionView";
import { View, ViewJson } from "../View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { NodeObj } from "../../objs/NodeObj";

export function isJoinPointView(view: View) {
    return view && view.viewType === JoinPointViewType;
}

export interface JoinPointViewJson extends ViewJson {
    point: string;
    slotName: string;
    isInput: boolean;
    connectionId: string;
}

export const JoinPointViewType = 'JoinPointViewType';
export class JoinPointView extends ContainedView {
    viewType = JoinPointViewType;
    id: string;
    point: Point;
    containerView: NodeView;
    connection: NodeConnectionView;
    slotName: string;
    isInput: boolean;
    bounds: Rectangle;

    constructor(parent: NodeView, config?: {slotName: string, isInput: boolean}) {
        super();
        this.containerView = parent;

        if (config) {
            this.slotName = config.slotName;
            this.isInput = config.isInput;
        }
    }

    getObj(): NodeObj {
        return this.containerView.getObj();
    }

    setObj(obj: NodeObj) {
        this.containerView.setObj(obj);
    }

    getAbsolutePosition() {
        return new Point(this.containerView.getBounds().topLeft.x + this.point.x, this.containerView.getBounds().topLeft.y + this.point.y); 
    }

    move(delta: Point) {
        if (this.connection) {
            this.isInput ? this.connection.setPoint1(this.getAbsolutePosition()) : this.connection.setPoint2(this.getAbsolutePosition());
        }
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    toString() {
        return `${this.viewType}: ${this.containerView.id} ${this.point.toString()}`;
    }

    toJson(): JoinPointViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            slotName: this.slotName,
            isInput: this.isInput,
            connectionId: this.connection.id
        }
    }

    fromJson(json: JoinPointViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
        this.slotName = json.slotName;
        this.isInput = json.isInput;
    }
}
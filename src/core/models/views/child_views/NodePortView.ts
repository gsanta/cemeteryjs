import { Point } from "../../../../utils/geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { ContainedView } from "./ChildView";
import { NodeConnectionView } from "../NodeConnectionView";
import { View, ViewJson } from "../View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { NodeObj } from "../../objs/NodeObj";

export function isJoinPointView(view: View) {
    return view && view.viewType === NodePortViewType;
}

export interface JoinPointViewJson extends ViewJson {
    point: string;
    slotName: string;
    isInput: boolean;
    connectionId: string;
}

export const NodePortViewType = 'NodePortViewType';
export class NodePortView extends ContainedView {
    viewType = NodePortViewType;
    id: string;
    point: Point;
    containerView: NodeView;
    connection: NodeConnectionView;
    port: string;
    isInput: boolean;
    bounds: Rectangle;

    constructor(parent: NodeView, config: {slotName: string, isInput: boolean}) {
        super();
        this.containerView = parent;

        
        if (config) {
            this.port = config.slotName;
            this.isInput = config.isInput;
        }
        this.id = this.port;
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
            slotName: this.port,
            isInput: this.isInput,
            connectionId: this.connection.id
        }
    }

    fromJson(json: JoinPointViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
        this.port = json.slotName;
        this.isInput = json.isInput;
    }
}
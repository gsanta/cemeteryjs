import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { NodePortObj } from "../../objs/NodePortObj";
import { PortDirection } from "../../objs/node_obj/NodeParam";
import { NodeConnectionView } from "../NodeConnectionView";
import { NodeView } from "../NodeView";
import { View, ViewJson } from "../View";
import { ContainedView } from "./ChildView";

export function isJoinPointView(view: View) {
    return view && view.viewType === NodePortViewType;
}

export interface NoePortViewJson extends ViewJson {
    point: string;
    connectionId: string;
}

export const NodePortViewType = 'NodePortViewType';
export class NodePortView extends ContainedView {
    viewType = NodePortViewType;
    id: string;
    point: Point;
    containerView: NodeView;
    private connection: NodeConnectionView;
    protected obj: NodePortObj;
    bounds: Rectangle;

    constructor(parent: NodeView, obj: NodePortObj) {
        super();
        this.containerView = parent;
        this.obj = obj;
        this.id = obj.id;
    }

    getObj(): NodePortObj {
        return this.obj;
    }

    setObj(obj: NodePortObj) {
        this.obj = obj;
    }

    getAbsolutePosition() {
        return new Point(this.containerView.getBounds().topLeft.x + this.point.x, this.containerView.getBounds().topLeft.y + this.point.y); 
    }

    move(delta: Point) {
        const portDirection = this.obj.getNodeParam().port.direction;
        if (this.connection) {
            portDirection === PortDirection.Input ? this.connection.setPoint1(this.getAbsolutePosition()) : this.connection.setPoint2(this.getAbsolutePosition());
        }
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    removeConnection() {
        this.obj.removeConnectedPort();
        this.containerView.deleteConstraiedViews.removeView(this.connection);
        this.connection = undefined;
    }

    setConnection(connection: NodeConnectionView) {
        this.connection = connection;
        this.containerView.deleteConstraiedViews.addView(connection);
    }

    getConnection(): NodeConnectionView {
        return this.connection;
    }

    toString() {
        return `${this.viewType}: ${this.containerView.id} ${this.point.toString()}`;
    }

    toJson(): NoePortViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            connectionId: this.connection.id
        }
    }

    fromJson(json: NoePortViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}
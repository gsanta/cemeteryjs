import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { NodePortObj } from "../../objs/NodePortObj";
import { PortDirection } from "../../objs/node_obj/NodeParam";
import { NodeConnectionView } from "../../../../plugins/canvas_plugins/node_editor/views/NodeConnectionView";
import { View, ViewJson } from "../View";
import { ContainedView } from "./ChildView";
import { NodeView } from "../../../../plugins/canvas_plugins/node_editor/views/NodeView";

export function isJoinPointView(view: View) {
    return view && view.viewType === NodePortViewType;
}

export interface NoePortViewJson extends ViewJson {
    point: string;
    connectionIds: string[];
}

export const NodePortViewType = 'NodePortViewType';
export class NodePortView extends ContainedView {
    viewType = NodePortViewType;
    id: string;
    point: Point;
    containerView: NodeView;
    private connections: NodeConnectionView[] = [];
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
        this.connections.forEach(connection => {
            portDirection === PortDirection.Input ? connection.setInputPoint(this.getAbsolutePosition()) : connection.setOutputPoint(this.getAbsolutePosition());
        });
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    removeConnection(connection: NodeConnectionView) {
        const otherPortView = connection.getOtherPortView(this);
        this.obj.removeConnectedPort(otherPortView.getObj());
        this.containerView.deleteConstraiedViews.removeView(connection);
        this.connections = this.connections.filter(conn => conn !== connection);
    }

    addConnection(connection: NodeConnectionView) {
        if (!this.connections.includes(connection)) {
            this.connections.push(connection);
            this.containerView.deleteConstraiedViews.addView(connection);
        }
    }

    toString() {
        return `${this.viewType}: ${this.containerView.id} ${this.point.toString()}`;
    }

    toJson(): NoePortViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            connectionIds: this.connections.map(connection => connection.id)
        }
    }

    fromJson(json: NoePortViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}
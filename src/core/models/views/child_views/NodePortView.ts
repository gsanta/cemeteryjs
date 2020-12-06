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

export interface NoePortViewJson extends ViewJson {
    point: string;
    slotName: string;
    portDirection: 'input' | 'output';
    connectionId: string;
}

export const NodePortViewType = 'NodePortViewType';
export class NodePortView extends ContainedView {
    viewType = NodePortViewType;
    id: string;
    point: Point;
    containerView: NodeView;
    private connection: NodeConnectionView;
    port: string;
    portDirection: 'input' | 'output';
    bounds: Rectangle;

    constructor(parent: NodeView, config: {portName: string, portDirection: 'input' | 'output'}) {
        super();
        this.containerView = parent;

        
        if (config) {
            this.port = config.portName;
            this.portDirection = config.portDirection;
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
            this.portDirection ? this.connection.setPoint1(this.getAbsolutePosition()) : this.connection.setPoint2(this.getAbsolutePosition());
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
        this.containerView.getObj().deleteConnection(this.port);
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
            slotName: this.port,
            portDirection: this.portDirection,
            connectionId: this.connection.id
        }
    }

    fromJson(json: NoePortViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
        this.port = json.slotName;
        this.portDirection = json.portDirection;
    }
}
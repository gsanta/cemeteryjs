import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../Registry";
import { NodeConnectionObj, NodeConnectionObjJson } from "../objs/NodeConnectionObj";
import { NodeView } from "./NodeView";
import { View, ViewFactory, ViewJson } from "./View";

export const NodeConnectionViewType = 'node-connection-view';

export interface NodeConnectionViewJson extends ViewJson {
    point1X: number;
    point1Y: number;
    point2X: number;
    point2Y: number;
    obj: NodeConnectionObjJson;
}

export class NodeConnectionViewFactory implements ViewFactory {
    viewType = NodeConnectionViewType;
    newInstance() { return new NodeConnectionView(); }
}

export class NodeConnectionView extends View {
    readonly  viewType = NodeConnectionViewType;

    point1: Point;
    point2: Point;
    protected obj: NodeConnectionObj;

    private updateDimensions() {
        if (this.point1 && this.point2) {
            this.bounds = Rectangle.fromTwoPoints(this.point1, this.point2);
        }
    }

    getObj(): NodeConnectionObj {
        return this.obj;
    }

    setObj(obj: NodeConnectionObj) {
        this.obj = obj;
    }

    move() {
        // action nodes will move their join points, so this object is automatically moved
    }

    setPoint1(point: Point) {
        this.point1 = point;
        this.updateDimensions();
    }

    setPoint2(point: Point) {
        this.point2 = point;
        this.updateDimensions();
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    toJson(): NodeConnectionViewJson {
        return {
            ...super.toJson(),
            point1X: this.point1.x,
            point1Y: this.point1.y,
            point2X: this.point2.x,
            point2Y: this.point2.y,
            obj: this.obj.toJson()
        };
    }

    fromJson(json: NodeConnectionViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.obj.fromJson(json.obj, registry);
        (registry.stores.viewStore.getById(this.obj.node1.id) as NodeView).findJoinPointView(this.obj.joinPoint1).connection = this;
        (registry.stores.viewStore.getById(this.obj.node2.id) as NodeView).findJoinPointView(this.obj.joinPoint2).connection = this;
        this.point1 = new Point(json.point1X, json.point1Y);
        this.point2 = new Point(json.point2X, json.point2Y);

        this.updateDimensions();
    }
}
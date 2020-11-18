import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { ViewPlugin } from "../../plugin/ViewPlugin";
import { Registry } from "../../Registry";
import { NodeConnectionObj, NodeConnectionObjJson } from "../objs/NodeConnectionObj";
import { JoinPointView } from "./child_views/JoinPointView";
import { NodeView } from "./NodeView";
import { View, ViewFactoryAdapter, ViewJson } from './View';

export const NodeConnectionViewType = 'node-connection-view';

export interface NodeConnectionViewJson extends ViewJson {
    point1X: number;
    point1Y: number;
    point2X: number;
    point2Y: number;
    obj: NodeConnectionObjJson;
    joinPoint1: {
        nodeId: string;
        joinPointName: string;
    };
    joinPoint2: {
        nodeId: string;
        joinPointName: string;
    }
}

export class NodeConnectionViewPlugin implements ViewPlugin {
    id = NodeConnectionViewType;

    createView() { return new NodeConnectionView(); }

    getController() {
        return undefined;
    }

    renderInto() {
        
    }
}

export class NodeConnectionViewFactory extends ViewFactoryAdapter {
    instantiate() {
        return new NodeConnectionView();
    }
}

export class NodeConnectionView extends View {
    readonly  viewType = NodeConnectionViewType;

    point1: Point;
    point2: Point;
    protected obj: NodeConnectionObj;
    joinPoint1: JoinPointView;
    joinPoint2: JoinPointView;

    updateDimensions() {
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

    move() {}

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
            obj: this.obj.serialize(),
            joinPoint1: {
                nodeId: this.joinPoint1.containerView.id,
                joinPointName: this.joinPoint1.slotName
            },
            joinPoint2: {
                nodeId: this.joinPoint2.containerView.id,
                joinPointName: this.joinPoint2.slotName
            }
        };
    }

    fromJson(json: NodeConnectionViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.joinPoint1 = (<NodeView> registry.data.view.node.getById(json.joinPoint1.nodeId)).findJoinPointView(json.joinPoint1.joinPointName);
        this.joinPoint2 = (<NodeView> registry.data.view.node.getById(json.joinPoint2.nodeId)).findJoinPointView(json.joinPoint2.joinPointName);
        this.joinPoint1.connection = this;
        this.joinPoint2.connection = this;
        this.point1 = new Point(json.point1X, json.point1Y);
        this.point2 = new Point(json.point2X, json.point2Y);

        this.updateDimensions();
    }
}
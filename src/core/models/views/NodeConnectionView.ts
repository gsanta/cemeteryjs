import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../Registry";
import { IObj } from "../objs/IObj";
import { PortDataFlow, PortDirection } from "../objs/node_obj/NodeParam";
import { NodePortView } from "./child_views/NodePortView";
import { NodeView } from "./NodeView";
import { View, ViewFactoryAdapter, ViewJson } from './View';

export const NodeConnectionViewType = 'node-connection-view';

export interface NodeConnectionViewJson extends ViewJson {
    point1X: number;
    point1Y: number;
    point2X: number;
    point2Y: number;
    joinPoint1: {
        nodeId: string;
        joinPointName: string;
    };
    joinPoint2: {
        nodeId: string;
        joinPointName: string;
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

    private nodePortView1: NodePortView;
    private nodePortview2: NodePortView;

    color

    updateDimensions() {
        if (this.point1 && this.point2) {
            this.bounds = Rectangle.fromTwoPoints(this.point1, this.point2);
        }
    }

    getObj(): IObj { return undefined;}

    setObj() { throw new Error('This view does not need any objs'); }

    move() {}

    setPoint1(point: Point) {
        this.point1 = point;
        this.updateDimensions();
    }

    setPoint2(point: Point) {
        this.point2 = point;
        this.updateDimensions();
    }

    setNodePortView1(nodePortView: NodePortView) {
        this.nodePortView1 = nodePortView;
        this.initColor();
    }

    getNodePortView1(): NodePortView {
        return this.nodePortView1;
    }

    setNodePortView2(nodePortView: NodePortView) {
        this.nodePortview2 = nodePortView;
    }

    getNodePortView2(): NodePortView {
        return this.nodePortview2;
    }

    getOtherPortView(portView: NodePortView) {
        if (portView === this.nodePortView1) {
            return this.nodePortview2;
        } else if (portView === this.nodePortview2) {
            return this.nodePortView1;
        } else {
            throw new Error(`NodeConnectionView does not contain PortView(${portView.id})`);
        }
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    getDirection() {
        this.nodePortView1.getObj().getNodeParam().port.direction;
    }

    dispose() {
        this.nodePortView1.removeConnection(this);
        this.nodePortview2.removeConnection(this);
    }

    private initColor() {
        if (this.nodePortView1.getObj().getNodeParam().port.dataFlow === PortDataFlow.Pull) {
            this.color = 'red';
        } else {
            this.color = 'green';
        }
    }

    toJson(): NodeConnectionViewJson {
        return {
            ...super.toJson(),
            point1X: this.point1.x,
            point1Y: this.point1.y,
            point2X: this.point2.x,
            point2Y: this.point2.y,
            joinPoint1: {
                nodeId: this.nodePortView1.containerView.id,
                joinPointName: this.nodePortView1.getObj().getNodeParam().name
            },
            joinPoint2: {
                nodeId: this.nodePortview2.containerView.id,
                joinPointName: this.nodePortview2.getObj().getNodeParam().name
            }
        };
    }

    fromJson(json: NodeConnectionViewJson, registry: Registry) {
        super.fromJson(json, registry);
        const nodeView1 = (<NodeView> registry.data.view.node.getById(json.joinPoint1.nodeId));
        const nodeView2 = (<NodeView> registry.data.view.node.getById(json.joinPoint2.nodeId))
        this.nodePortView1 = <NodePortView> nodeView1.findJoinPointView(json.joinPoint1.joinPointName);
        this.nodePortview2 = <NodePortView> nodeView2.findJoinPointView(json.joinPoint2.joinPointName);
        this.nodePortView1.addConnection(this);
        this.nodePortview2.addConnection(this);
        this.point1 = new Point(json.point1X, json.point1Y);
        this.point2 = new Point(json.point2X, json.point2Y);

        this.updateDimensions();
    }
}
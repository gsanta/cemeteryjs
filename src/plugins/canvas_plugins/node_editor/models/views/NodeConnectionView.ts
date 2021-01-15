import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../../../core/Registry";
import { IObj } from "../../../../../core/models/objs/IObj";
import { PortDataFlow } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodePortView } from "../../../../../core/models/views/child_views/NodePortView";
import { NodeView } from "./NodeView";
import { View, ViewFactoryAdapter, ViewJson } from '../../../../../core/models/views/View';
import { colors } from "../../../../../core/ui_components/react/styles";

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

    inputPoint: Point;
    outputPoint: Point;

    private nodePortView1: NodePortView;
    private nodePortview2: NodePortView;

    color

    updateDimensions() {
        if (this.inputPoint && this.outputPoint) {
            this.bounds = Rectangle.fromTwoPoints(this.inputPoint, this.outputPoint);
        }
    }

    getObj(): IObj { return undefined;}

    setObj() { throw new Error('This view does not need any objs'); }

    move() {}

    setInputPoint(point: Point) {
        this.inputPoint = point;
        this.updateDimensions();
    }

    setOutputPoint(point: Point) {
        this.outputPoint = point;
        this.updateDimensions();
    }

    setInputPort(nodePortView: NodePortView) {
        this.nodePortView1 = nodePortView;
        this.initColor();
    }

    getInputPort(): NodePortView {
        return this.nodePortView1;
    }

    setOutputPort(nodePortView: NodePortView) {
        this.nodePortview2 = nodePortView;
    }

    getOutputPort(): NodePortView {
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
        this.nodePortView1.getObj().getNodeParam().portDirection;
    }

    dispose() {
        this.nodePortView1.removeConnection(this);
        this.nodePortview2.removeConnection(this);
    }

    private initColor() {
        if (this.nodePortView1.getObj().getNodeParam().portDataFlow === PortDataFlow.Pull) {
            this.color = colors.nodes.connectionRed;
        } else {
            this.color = colors.nodes.connectionGreen;
        }
    }

    toJson(): NodeConnectionViewJson {
        return {
            ...super.toJson(),
            point1X: this.inputPoint.x,
            point1Y: this.inputPoint.y,
            point2X: this.outputPoint.x,
            point2Y: this.outputPoint.y,
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
        this.setInputPort(<NodePortView> nodeView1.findJoinPointView(json.joinPoint1.joinPointName));
        this.setOutputPort(<NodePortView> nodeView2.findJoinPointView(json.joinPoint2.joinPointName));
        this.nodePortView1.addConnection(this);
        this.nodePortview2.addConnection(this);
        this.inputPoint = new Point(json.point1X, json.point1Y);
        this.outputPoint = new Point(json.point2X, json.point2Y);

        this.updateDimensions();
    }
}
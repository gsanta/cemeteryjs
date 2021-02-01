import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../../../core/Registry";
import { IObj } from "../../../../../core/models/objs/IObj";
import { PortDataFlow } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodePortShape } from "../../../../../core/models/shapes/child_views/NodePortShape";
import { NodeShape } from "./NodeShape";
import { AbstractShape, ShapeFactoryAdapter, ShapeJson } from '../../../../../core/models/shapes/AbstractShape';
import { colors } from "../../../../../core/ui_components/react/styles";

export const NodeConnectionShapeType = 'node-connection-shape';

export interface NodeConnectionShapeJson extends ShapeJson {
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

export class NodeConnectionShapeFactory extends ShapeFactoryAdapter {
    instantiate() {
        return new NodeConnectionShape();
    }
}

export class NodeConnectionShape extends AbstractShape {
    readonly  viewType = NodeConnectionShapeType;

    inputPoint: Point;
    outputPoint: Point;

    private nodePortView1: NodePortShape;
    private nodePortview2: NodePortShape;

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

    setInputPort(nodePortView: NodePortShape) {
        this.nodePortView1 = nodePortView;
        this.initColor();
    }

    getInputPort(): NodePortShape {
        return this.nodePortView1;
    }

    setOutputPort(nodePortView: NodePortShape) {
        this.nodePortview2 = nodePortView;
    }

    getOutputPort(): NodePortShape {
        return this.nodePortview2;
    }

    getOtherPortView(portView: NodePortShape) {
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

    toJson(): NodeConnectionShapeJson {
        return {
            ...super.toJson(),
            point1X: this.inputPoint.x,
            point1Y: this.inputPoint.y,
            point2X: this.outputPoint.x,
            point2Y: this.outputPoint.y,
            joinPoint1: {
                nodeId: this.nodePortView1.containerShape.id,
                joinPointName: this.nodePortView1.getObj().getNodeParam().name
            },
            joinPoint2: {
                nodeId: this.nodePortview2.containerShape.id,
                joinPointName: this.nodePortview2.getObj().getNodeParam().name
            }
        };
    }

    fromJson(json: NodeConnectionShapeJson, registry: Registry) {
        super.fromJson(json, registry);
        const nodeView1 = (<NodeShape> registry.data.shape.node.getItemById(json.joinPoint1.nodeId));
        const nodeView2 = (<NodeShape> registry.data.shape.node.getItemById(json.joinPoint2.nodeId))
        this.setInputPort(<NodePortShape> nodeView1.findJoinPointView(json.joinPoint1.joinPointName));
        this.setOutputPort(<NodePortShape> nodeView2.findJoinPointView(json.joinPoint2.joinPointName));
        this.nodePortView1.addConnection(this);
        this.nodePortview2.addConnection(this);
        this.inputPoint = new Point(json.point1X, json.point1Y);
        this.outputPoint = new Point(json.point2X, json.point2Y);

        this.updateDimensions();
    }
}
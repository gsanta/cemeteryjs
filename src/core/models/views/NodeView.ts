import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { VisualConcept } from "../concepts/VisualConcept";
import { JoinPointView } from "./child_views/JoinPointView";
import { AbstractNode } from "./nodes/AbstractNode";
import { createNode } from "./nodes/nodeFactory";
import { ConceptType, View } from "./View";
import { NodeGraph } from '../NodeGraph';

export class NodeView<T extends AbstractNode = AbstractNode> extends VisualConcept {
    readonly  type = ConceptType.ActionConcept;
    readonly id: string;
    node: T;
    dimensions: Rectangle;
    nodeGraph: NodeGraph;

    constructor(id: string, nodeType: string, dimensions: Rectangle, nodeGraph: NodeGraph) {
        super();
        this.id = id;
        this.dimensions = dimensions;
        this.nodeGraph = nodeGraph;
        this.node = <T> createNode(nodeType, this);
        this.node.inputSlots.forEach(inputSlot => inputSlot.connectionPoint = new JoinPointView(this, inputSlot, true));
        this.node.outputSlots.forEach(outputSlot => outputSlot.connectionPoint = new JoinPointView(this, outputSlot, false));
    }

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        this.node.inputSlots.forEach(input => input.connectionPoint && input.connectionPoint.move(point));
        this.node.outputSlots.forEach(output => output.connectionPoint && output.connectionPoint.move(point));
    }

    delete(): View[] {
        const inputConnectionPoints = this.node.inputSlots.map(inputSlot => inputSlot.connectionPoint);
        const outputConnectionPoints =  this.node.outputSlots.map(outputSlot => outputSlot.connectionPoint);
        const inputConnections = inputConnectionPoints.map(connPoint => connPoint && connPoint.connection);
        const outputConnections = outputConnectionPoints.map(connPoint => connPoint && connPoint.connection);
        return [this, ...inputConnectionPoints, ...outputConnectionPoints, ...inputConnections, ...outputConnections].filter(item => item !== undefined);
    }

    getAllAdjacentNodes(): NodeView[] {
        const inputs = this.node.inputSlots.map(slot => slot.connectionPoint && slot.connectionPoint.getOtherNode());
        const outputs = this.node.outputSlots.map(slot => slot.connectionPoint && slot.connectionPoint.getOtherNode());
        return [...inputs, ...outputs].filter(node => node !== undefined);
    }

    editPoints = [];
}
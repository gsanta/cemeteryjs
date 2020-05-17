import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { VisualConcept } from "../concepts/VisualConcept";
import { JoinPointView } from "./child_views/JoinPointView";
import { AbstractNode } from "./nodes/AbstractNode";
import { createNode } from "./nodes/nodeFactory";
import { ConceptType, View } from "./View";

export class NodeView<T extends AbstractNode = AbstractNode> extends VisualConcept {
    readonly  type = ConceptType.ActionConcept;
    readonly id: string;
    data: T;
    dimensions: Rectangle;

    constructor(id: string, nodeType: string, dimensions: Rectangle) {
        super();
        this.id = id;
        this.dimensions = dimensions;
        this.data = <T> createNode(nodeType);

        this.data.inputSlots.forEach(inputSlot => inputSlot.connectionPoint = new JoinPointView(this, inputSlot, true));
        this.data.outputSlots.forEach(outputSlot => outputSlot.connectionPoint = new JoinPointView(this, outputSlot, false));
    }

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        this.data.inputSlots.forEach(input => input.connectionPoint && input.connectionPoint.move(point));
        this.data.outputSlots.forEach(output => output.connectionPoint && output.connectionPoint.move(point));
    }

    delete(): View[] {
        const inputConnectionPoints = this.data.inputSlots.map(inputSlot => inputSlot.connectionPoint);
        const outputConnectionPoints =  this.data.outputSlots.map(outputSlot => outputSlot.connectionPoint);
        const inputConnections = inputConnectionPoints.map(connPoint => connPoint && connPoint.connection);
        const outputConnections = outputConnectionPoints.map(connPoint => connPoint && connPoint.connection);
        return [this, ...inputConnectionPoints, ...outputConnectionPoints, ...inputConnections, ...outputConnections].filter(item => item !== undefined);
    }

    editPoints = [];
}
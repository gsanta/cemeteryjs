import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { JoinPointView } from "./control/JoinPointView";
import { INode } from "./nodes/INode";
import { ConceptType, View } from "./View";
import { VisualConcept } from "../concepts/VisualConcept";
import { createNode } from "./nodes/nodeFactory";

export class NodeView<T extends INode = any> extends VisualConcept {
    readonly  type = ConceptType.ActionConcept;
    readonly id: string;
    data: T;

    dimensions: Rectangle;
    inputs: JoinPointView[] = [];
    outputs: JoinPointView[] = [];

    constructor(id: string, nodeType: string, dimensions: Rectangle) {
        super();
        this.id = id;
        this.dimensions = dimensions;
        this.data = <T> createNode(nodeType);
        this.initInputNodeConnectionControls();
        this.initOutputNodeConnectionControls();
    }

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        this.inputs.forEach(input => input.move(point));
        
        this.outputs.forEach(output => output.move(point));
    }

    delete(): View[] {
        const inputConnections = this.inputs.map(input => input.connection);
        const outputConnections = this.outputs.map(input => input.connection);
        return [this, ...this.inputs, ...this.outputs, ...inputConnections, ...outputConnections].filter(item => item !== undefined);
    }

    private initInputNodeConnectionControls() {
        const yStart = this.dimensions.topLeft.y + 50;
        const x = this.dimensions.topLeft.x;

        for (let i = 0; i < this.data.inputSlots; i++) {
            const y = i * 20 + yStart; 
            this.inputs.push(new JoinPointView(this, i, true));
        }
    }

    private initOutputNodeConnectionControls() {
        const yStart = this.dimensions.topLeft.y + 50;
        const x = this.dimensions.bottomRight.x;

        for (let i = 0; i < this.data.outputSlots; i++) {
            const y = i * 20 + yStart; 
            this.outputs.push(new JoinPointView(this, i, false));
        }
    } 

    editPoints = [];
}
import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { JoinPointControl } from "../controls/JoinPointControl";
import { INode } from "./nodes/INode";
import { ConceptType } from "../concepts/Concept";
import { VisualConcept } from "../concepts/VisualConcept";
import { createNode } from "./nodes/nodeFactory";

export class NodeView<T extends INode = any> implements VisualConcept {
    readonly  type = ConceptType.ActionConcept;
    readonly id: string;
    data: T;

    dimensions: Rectangle;
    inputs: JoinPointControl[] = [];
    outputs: JoinPointControl[] = [];

    constructor(id: string, nodeType: string, dimensions: Rectangle) {
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

    private initInputNodeConnectionControls() {
        const yStart = this.dimensions.topLeft.y + 50;
        const x = this.dimensions.topLeft.x;

        for (let i = 0; i < this.data.inputSlots; i++) {
            const y = i * 20 + yStart; 
            this.inputs.push(new JoinPointControl(this, i, true));
        }
    }

    private initOutputNodeConnectionControls() {
        const yStart = this.dimensions.topLeft.y + 50;
        const x = this.dimensions.bottomRight.x;

        for (let i = 0; i < this.data.outputSlots; i++) {
            const y = i * 20 + yStart; 
            this.outputs.push(new JoinPointControl(this, i, false));
        }
    } 

    editPoints = [];
}
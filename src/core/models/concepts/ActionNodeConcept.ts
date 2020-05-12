import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { NodeConnectionControl } from "../controls/NodeConnectionControl";
import { IActionNode } from "./action_node/IActionNode";
import { ConceptType } from "./Concept";
import { VisualConcept } from "./VisualConcept";
import { createActionNode } from "./action_node/actionNodeFactory";

export class ActionNodeConcept implements VisualConcept {
    type = ConceptType.ActionConcept;
    id: string;
    data: IActionNode;

    dimensions: Rectangle;
    inputs: NodeConnectionControl[] = [];
    outputs: NodeConnectionControl[] = [];

    constructor(nodeType: string) {
        this.data = createActionNode(nodeType);
        for (let i = 0; i < this.data.inputSlots; i++) {
            this.inputs.push(new NodeConnectionControl(this));
        }

        for (let i = 0; i < this.data.outputSlots; i++) {
            this.outputs.push(new NodeConnectionControl(this));
        }
    }

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }

    editPoints = [];
}
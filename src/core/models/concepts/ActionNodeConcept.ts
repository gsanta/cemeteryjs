import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { NodeConnectorControl } from "../controls/NodeConnectorControl";
import { IActionNode } from "./action_node/IActionNode";
import { ConceptType } from "./Concept";
import { VisualConcept } from "./VisualConcept";

export class ActionNodeConcept implements VisualConcept {
    type = ConceptType.ActionConcept;
    id: string;
    data: IActionNode;

    dimensions: Rectangle;
    inputs: NodeConnectorControl[];
    outputs: NodeConnectorControl[];

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }

    editPoints = [];
}
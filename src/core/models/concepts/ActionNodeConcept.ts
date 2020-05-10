import { ConceptType } from "./Concept";
import { VisualConcept } from "./VisualConcept";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { EditPoint } from "../feedbacks/EditPoint";
import { Point } from "../../geometry/shapes/Point";
import { IActionNode } from "./action_node/IActionNode";

export class ActionNodeConcept implements VisualConcept {
    type = ConceptType.ActionConcept;
    id: string;
    data: IActionNode;

    dimensions: Rectangle;
    inputs: ActionNodeConcept[];
    outputs: ActionNodeConcept[];

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }
    editPoints = [];
    deleteEditPoint(editPoint: EditPoint): void {}
    moveEditPoint(editPoint: EditPoint, delta: Point): void {}
}
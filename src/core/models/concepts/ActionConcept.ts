import { ConceptType } from "./Concept";
import { VisualConcept } from "./VisualConcept";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { EditPoint } from "../feedbacks/EditPoint";
import { Point } from "../../geometry/shapes/Point";

export class ActionConcept implements VisualConcept {
    type = ConceptType.ActionConcept;
    id: string;
    
    actionType: string;
    inputs: ActionConcept[];
    outputs: ActionConcept[];

    dimensions: Rectangle;

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }
    editPoints = [];
    deleteEditPoint(editPoint: EditPoint): void {}
    moveEditPoint(editPoint: EditPoint, delta: Point): void {}
}
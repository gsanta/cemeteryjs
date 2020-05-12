import { Concept } from "./Concept";
import { EditPoint } from "../feedbacks/EditPoint";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Point } from "../../geometry/shapes/Point";


export interface VisualConcept extends Concept {
    dimensions: Rectangle;
    move(delta: Point): void;
}
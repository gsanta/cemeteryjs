import { View } from "../views/View";
import { EditPointView } from "../views/control/EditPointView";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Point } from "../../geometry/shapes/Point";


export interface VisualConcept extends View {
    dimensions: Rectangle;
    move(delta: Point): void;
}
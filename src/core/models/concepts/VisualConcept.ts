import { View } from "../views/View";
import { EditPointView } from "../views/child_views/EditPointView";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Point } from "../../geometry/shapes/Point";


export abstract class VisualConcept implements View {
    id: string;
    type: string;

    dimensions: Rectangle;
    move(delta: Point): void {}
    delete(): View[] { return [this] }
}
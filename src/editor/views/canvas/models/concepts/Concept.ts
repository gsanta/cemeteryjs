import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { CanvasItem } from "../CanvasItem";
import { Feedback } from "../feedbacks/Feedback";
import { EditPoint } from "../feedbacks/EditPoint";

export interface Concept extends CanvasItem {
    editPoints: EditPoint[];
    dimensions: Rectangle;
    name: string;
    hoveredSubconcept?: Subconcept;
    deleteEditPoint(editPoint: EditPoint): void;
    move(delta: Point): void;
    moveEditPoint(editPoint: EditPoint, delta: Point): void;
}

export interface Subconcept extends CanvasItem {
    parentConcept: Concept;
    over(): void;
    out(): void;
}
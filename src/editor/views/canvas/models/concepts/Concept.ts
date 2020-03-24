import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { CanvasItem } from "../CanvasItem";

export interface Concept extends CanvasItem {
    editPoints: Point[];
    dimensions: Rectangle;
    name: string;
    selectHoveredSubview(): void;
    hoveredSubconcept?: Subconcept;
    deleteSubconcept(subconcept: Subconcept): void;
    move(point: Point): void;
}

export interface Subconcept extends CanvasItem {
    parentConcept: Concept;
    over(): void;
    out(): void;
}
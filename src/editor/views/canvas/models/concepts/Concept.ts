import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";

export enum ConceptType {
    Mesh = 'Mesh',
    Path = 'Path',
    Subconcept = 'Subconcept'
}

export interface Concept {
    conceptType: ConceptType;
    dimensions: Rectangle;
    name: string;
    selectHoveredSubview(): void;
    isSubviewHovered(): boolean;
    move(point: Point): void;
}

export interface Subconcept {
    parentConcept: Concept;
    conceptType: ConceptType;
    over(): void;
    out(): void;
}
import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { EditPoint } from "../feedbacks/EditPoint";
import { TypedItem } from "../../../../stores/CanvasStore";

export enum ConceptType {
    MeshConcept = 'MeshConcept',
    PathConcept = 'PathConcept',
    AnimationConcept = 'AnimationConcept'
}

export interface Concept extends TypedItem {
    id: string;
    editPoints: EditPoint[];
    dimensions: Rectangle;
    deleteEditPoint(editPoint: EditPoint): void;
    move(delta: Point): void;
    moveEditPoint(editPoint: EditPoint, delta: Point): void;
}
import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { EditPoint } from "../feedbacks/EditPoint";
import { TypedItem } from "../../../../stores/CanvasStore";

export enum ConceptType {
    MeshConcept = 'MeshConcept',
    ModelConcept = 'ModelConcept',
    PathConcept = 'PathConcept',
    AnimationConcept = 'AnimationConcept'
}

export interface Concept extends TypedItem {
    id: string;
}
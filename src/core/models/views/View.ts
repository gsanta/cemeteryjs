import { Hoverable } from "../Hoverable";

export enum ConceptType {
    MeshConcept = 'MeshConcept',
    ModelConcept = 'ModelConcept',
    PathConcept = 'PathConcept',
    AnimationConcept = 'AnimationConcept',
    RouteConcept = 'RouteConcept',
    ActionConcept = 'ActionConcept',
    ActionNodeConnectionConcept = 'ActionNodeConnectionConcept' 
}

export interface View extends Hoverable {
    id: string;
}

export enum ConceptType {
    MeshConcept = 'MeshConcept',
    ModelConcept = 'ModelConcept',
    PathConcept = 'PathConcept',
    AnimationConcept = 'AnimationConcept',
    RouteConcept = 'RouteConcept'
}

export interface Concept {
    id: string;
    type: string;
}
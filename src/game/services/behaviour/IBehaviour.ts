import { MeshConcept } from "../../../editor/models/concepts/MeshConcept";

export enum BehaviourType {
    Ramble = 'Ramble'
}

export interface IBehaviour {
    type: BehaviourType;
    update(gameObject: MeshConcept);
    canActivate(gameObject: MeshConcept): boolean;
}
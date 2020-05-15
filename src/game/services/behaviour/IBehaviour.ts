import { MeshView } from "../../../core/models/views/MeshView";

export enum BehaviourType {
    Ramble = 'Ramble'
}

export interface IBehaviour {
    type: BehaviourType;
    update(gameObject: MeshView);
    canActivate(gameObject: MeshView): boolean;
}
import { MeshObject } from "../../models/objects/MeshObject";

export enum BehaviourType {
    Ramble = 'Ramble'
}

export interface IBehaviour {
    type: BehaviourType;
    update(gameObject: MeshObject);
    canActivate(gameObject: MeshObject): boolean;
}
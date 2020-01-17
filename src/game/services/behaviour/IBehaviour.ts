import { GameObject } from "../../../world_generator/services/GameObject";

export enum BehaviourType {
    Ramble = 'Ramble'
}

export interface IBehaviour {
    type: BehaviourType;
    update(gameObject: GameObject);
    canActivate(gameObject: GameObject): boolean;
}
import { GameObject } from '../types/GameObject';

export interface IGameObjectBuilder {
    build(worldMap: string): GameObject[];
}
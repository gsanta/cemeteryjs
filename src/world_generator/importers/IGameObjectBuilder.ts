import { GameObject } from '../services/GameObject';

export interface IGameObjectBuilder {
    build(worldMap: string): GameObject[];
}
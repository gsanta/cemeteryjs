import { GlobalConfig } from "../world_generator/importers/svg/GlobalSectionParser";
import { GameObject } from "../world_generator/services/GameObject";


export interface IGameObjectStore {
    globalConfig: GlobalConfig;
    gameObjects: GameObject[];
}
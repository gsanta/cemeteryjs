import { GlobalConfig } from '../../world_generator/importers/svg/GlobalSectionParser';
import { GameObject } from '../../world_generator/services/GameObject';

export class GameObjectStore {
    globalConfig: GlobalConfig;
    gameObjects: GameObject[];

    constructor(globalConfig?: GlobalConfig) {
        this.globalConfig = globalConfig;
    }

    getPlayer(): GameObject {
        throw new Error('not implemented.');
    }
}
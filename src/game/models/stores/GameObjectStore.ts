import { GlobalConfig } from '../../../world_generator/importers/svg/GlobalSectionParser';
import { GameObject } from '../../../world_generator/services/GameObject';

export class GameObjectStore {
    globalConfig: GlobalConfig;
    gameObjects: GameObject[];

    constructor(globalConfig?: GlobalConfig) {
        this.globalConfig = globalConfig;
    }

    getPlayer(): GameObject {
        return this.gameObjects.find(gameObject => gameObject.name === 'player');
    }

    getEnemies(): GameObject[] {
        return this.gameObjects.filter(gameObject => gameObject.name === 'enemy');
    }
}
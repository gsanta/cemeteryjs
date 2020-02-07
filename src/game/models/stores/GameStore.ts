import { GlobalConfig } from '../../../world_generator/importers/svg/GlobalSectionParser';
import { GameObject } from '../../../world_generator/services/GameObject';
import { PathView } from '../../../editor/controllers/canvases/svg/tools/path/PathTool';

export class GameStore {
    globalConfig: GlobalConfig;
    gameObjects: GameObject[] = [];
    paths: PathView[] = [];

    constructor(globalConfig?: GlobalConfig) {
        this.globalConfig = globalConfig;
    }

    getPlayer(): GameObject {
        return this.gameObjects.find(gameObject => gameObject.name === 'player');
    }

    getEnemies(): GameObject[] {
        return this.gameObjects.filter(gameObject => gameObject.name === 'enemy');
    }

    addGameObject(gameObject: GameObject): GameObject {
        this.gameObjects.push(gameObject);

        return gameObject;
    }

    addPath(arrow: PathView) {
        this.paths.push(arrow);
    }

    clear(): void {
        this.gameObjects = [];
        this.paths = [];
    }
}
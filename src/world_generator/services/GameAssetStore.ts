import { GameObjectTemplate, WorldItemRole } from './GameObjectTemplate';
import { GlobalConfig } from '../importers/text/GlobalSectionParser';
import { GameObject } from './GameObject';

export class GameAssetStore {
    globalConfig: GlobalConfig;
    
    gameObjectTemplates: GameObjectTemplate[];
    gameObjects: GameObject[];

    constructor(gameObjectTemplates: GameObjectTemplate[] = [], globalConfig?: GlobalConfig) {
        this.setWorldItemTemplates(gameObjectTemplates);
        this.globalConfig = globalConfig;
    }

    setWorldItemTemplates(gameObjectTemplates: GameObjectTemplate[]) {
        this.gameObjectTemplates = gameObjectTemplates;
        this.gameObjectTemplates.push({
            id: GameObjectTemplate.generateId(this.gameObjectTemplates),
            typeName: 'root',
            shape: 'rectangle',
            roles: [WorldItemRole.CONTAINER],
        });
    }
}
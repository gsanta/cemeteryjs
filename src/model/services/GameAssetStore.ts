import { GameObjectTemplate, WorldItemRole } from '../types/GameObjectTemplate';
import { GlobalConfig } from '../readers/text/GlobalSectionParser';
import { GameObject } from '../types/GameObject';

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
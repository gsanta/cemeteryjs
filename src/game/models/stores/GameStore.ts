import { GlobalConfig } from '../../../world_generator/importers/svg/GlobalSectionParser';
import { GameObject } from '../../../world_generator/services/GameObject';
import { PathView } from '../../../editor/controllers/canvases/svg/tools/path/PathTool';
import { MeshObject } from '../objects/MeshObject';
import { IGameObject, GameObjectType } from '../objects/IGameObject';

export class GameStore {
    globalConfig: GlobalConfig;
    meshObjects: MeshObject[] = [];
    paths: PathView[] = [];

    objs: IGameObject[] = [];

    constructor(globalConfig?: GlobalConfig) {
        this.globalConfig = globalConfig;
    }

    getPlayer(): MeshObject {
        return <MeshObject> this.objs.find(gameObject => gameObject.name === 'player');
    }

    getEnemies(): MeshObject[] {
        return <MeshObject[]> this.objs.filter(gameObject => gameObject.name === 'enemy');
    }

    addPath(arrow: PathView) {
        this.paths.push(arrow);
    }

    add(gameObject: IGameObject) {
        this.objs.push(gameObject);
    }

    getMeshObjects(): MeshObject[] {
        return <MeshObject[]> this.objs.filter(obj => obj.objectType === GameObjectType.MeshObject);
    }

    clear(): void {
        this.paths = [];
        this.objs = [];
    }
}
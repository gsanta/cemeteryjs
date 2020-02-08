import { MeshObject } from '../objects/MeshObject';
import { IGameObject, GameObjectType } from '../objects/IGameObject';
import { PathView } from '../../../common/views/PathView';

export class GameStore {
    meshObjects: MeshObject[] = [];
    paths: PathView[] = [];

    objs: IGameObject[] = [];

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
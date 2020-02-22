import { MeshObject } from '../objects/MeshObject';
import { IGameObject, GameObjectType } from '../objects/IGameObject';
import { PathView } from '../../../editor/canvas/models/views/PathView';
import { RouteObject } from '../objects/RouteObject';

export class GameStore {
    meshObjects: MeshObject[] = [];
    paths: PathView[] = [];

    private nameToObjMap: Map<string, IGameObject> = new Map();

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
        this.nameToObjMap.set(gameObject.name, gameObject);
    }

    getByName<T extends IGameObject>(name: string): T {
        return <T> this.nameToObjMap.get(name);
    }

    getMeshObjects(): MeshObject[] {
        return <MeshObject[]> this.objs.filter(obj => obj.objectType === GameObjectType.MeshObject);
    }

    getRouteObjects(): RouteObject[] {
        return <RouteObject[]> this.objs.filter(obj => obj.objectType === GameObjectType.RouteObject);
    }

    clear(): void {
        this.paths = [];
        this.objs = [];
    }
}
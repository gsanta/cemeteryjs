import { MeshObject } from '../objects/MeshObject';
import { IGameObject, GameObjectType } from '../objects/IGameObject';
import { RouteObject } from '../objects/RouteObject';
import { PathConcept } from '../../../editor/views/canvas/models/concepts/PathConcept';

export class GameStore {
    meshObjects: MeshObject[] = [];
    paths: PathConcept[] = [];

    private nameToObjMap: Map<string, IGameObject> = new Map();

    objs: IGameObject[] = [];

    getPlayer(): MeshObject {
        return <MeshObject> this.objs.find(gameObject => gameObject.name === 'player');
    }

    getEnemies(): MeshObject[] {
        return <MeshObject[]> this.objs.filter(gameObject => gameObject.name === 'enemy');
    }

    addPath(arrow: PathConcept) {
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

    isEmpty(): boolean {
        return this.meshObjects.length === 0;
    }
}
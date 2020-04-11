import { MeshObject } from '../objects/MeshObject';
import { IGameObject, GameObjectType } from '../objects/IGameObject';
import { RouteObject } from '../objects/RouteObject';
import { PathConcept } from '../../../editor/views/canvas/models/concepts/PathConcept';
import { Concept } from '../../../editor/views/canvas/models/concepts/Concept';

export class GameStore {
    
    private nameToObjMap: Map<string, IGameObject> = new Map();
    
    objs: IGameObject[] = [];

    getPlayer(): MeshObject {
        return <MeshObject> this.objs.find(gameObject => gameObject.id === 'player');
    }

    getEnemies(): MeshObject[] {
        return <MeshObject[]> this.objs.filter(gameObject => gameObject.id === 'enemy');
    }

    add(gameObject: IGameObject) {
        this.objs.push(gameObject);
        this.nameToObjMap.set(gameObject.id, gameObject);
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

    deleteById(id: string) {
        this.objs = this.objs.filter(obj => obj.id !== id);
    }

    clear(): void {
        this.objs = [];
    }

    isEmpty(): boolean {
        return this.objs.length === 0;
    }
}
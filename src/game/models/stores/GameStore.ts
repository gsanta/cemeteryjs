import { MeshObject } from '../objects/MeshObject';
import { IGameObject, GameObjectType } from '../objects/IGameObject';
import { RouteObject } from '../objects/RouteObject';
import { without } from '../../../misc/geometry/utils/Functions';
import { Stores } from '../../../editor/stores/Stores';

export class GameStore {
    private nameToObjMap: Map<string, IGameObject> = new Map();
    private getStores: () => Stores;

    objs: IGameObject[] = [];

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

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
        const obj = this.objs.find(obj => obj.id === id);

        switch(obj.objectType) {
            case GameObjectType.MeshObject:
                this.getStores().meshStore.deleteInstance((<MeshObject> obj).getMesh());
            break;
        }

        this.nameToObjMap.delete(id);
        this.objs = this.objs.filter(obj => obj.id !== id);
    }

    clear(): void {
        this.objs = [];
        this.getStores().meshStore.clear();
    }

    isEmpty(): boolean {
        return this.objs.length === 0;
    }
}
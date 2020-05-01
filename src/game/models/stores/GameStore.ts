import { MeshObject } from '../objects/MeshObject';
import { IGameObject } from '../objects/IGameObject';
import { RouteObject } from '../objects/RouteObject';
import { ConceptType } from '../../../editor/views/canvas/models/concepts/Concept';
import { Registry } from '../../../editor/Registry';

export class GameStore {
    private nameToObjMap: Map<string, IGameObject> = new Map();
    private registry: Registry;

    objs: IGameObject[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
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
        return <MeshObject[]> this.objs.filter(obj => obj.type === ConceptType.MeshConcept);
    }

    getRouteObjects(): RouteObject[] {
        return <RouteObject[]> this.objs.filter(obj => obj.type === ConceptType.RouteConcept);
    }

    deleteById(id: string) {
        const obj = this.objs.find(obj => obj.id === id);

        switch(obj.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.deleteInstance((<MeshObject> obj).getMesh());
            break;
        }

        this.nameToObjMap.delete(id);
        this.objs = this.objs.filter(obj => obj.id !== id);
    }

    clear(): void {
        this.objs = [];
        this.registry.stores.meshStore.clear();
    }

    isEmpty(): boolean {
        return this.objs.length === 0;
    }
}
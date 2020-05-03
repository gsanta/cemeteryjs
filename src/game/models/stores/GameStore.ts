import { IGameObject } from '../objects/IGameObject';
import { RouteObject } from '../objects/RouteObject';
import { ConceptType } from '../../../editor/models/concepts/Concept';
import { Registry } from '../../../editor/Registry';
import { MeshConcept } from '../../../editor/models/concepts/MeshConcept';

export class GameStore {
    private nameToObjMap: Map<string, IGameObject> = new Map();
    private registry: Registry;

    objs: IGameObject[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
    }

    getEnemies(): MeshConcept[] {
        return <MeshConcept[]> this.objs.filter(gameObject => gameObject.id === 'enemy');
    }

    add(gameObject: IGameObject) {
        this.objs.push(gameObject);
        this.nameToObjMap.set(gameObject.id, gameObject);
    }

    getByName<T extends IGameObject>(name: string): T {
        return <T> this.nameToObjMap.get(name);
    }

    getMeshObjects(): MeshConcept[] {
        return <MeshConcept[]> this.objs.filter(obj => obj.type === ConceptType.MeshConcept);
    }

    getPlayer(): MeshConcept {
        return this.getMeshObjects().find(obj => obj.isManualControl);
    }

    getRouteById(id: string): RouteObject {
        return <RouteObject> this.nameToObjMap.get(id);
    }

    getRouteObjects(): RouteObject[] {
        return <RouteObject[]> this.objs.filter(obj => obj.type === ConceptType.RouteConcept);
    }

    deleteById(id: string) {
        const obj = this.objs.find(obj => obj.id === id);

        switch(obj.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.deleteInstance((<MeshConcept> obj).mesh);
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
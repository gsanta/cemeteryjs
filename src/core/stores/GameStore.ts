import { IGameObject } from '../../game/models/objects/IGameObject';
import { RouteObject } from '../../game/models/objects/RouteObject';
import { Registry } from '../Registry';
import { MeshView } from '../models/views/MeshView';
import { ConceptType } from '../models/views/View';

export class GameStore {
    private nameToObjMap: Map<string, IGameObject> = new Map();
    private registry: Registry;

    objs: IGameObject[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
    }

    getEnemies(): MeshView[] {
        return <MeshView[]> this.objs.filter(gameObject => gameObject.id === 'enemy');
    }

    add(gameObject: IGameObject) {
        this.objs.push(gameObject);
        this.nameToObjMap.set(gameObject.id, gameObject);
    }

    getByName<T extends IGameObject>(name: string): T {
        return <T> this.nameToObjMap.get(name);
    }

    getMeshObjects(): MeshView[] {
        return <MeshView[]> this.objs.filter(obj => obj.type === ConceptType.MeshConcept);
    }

    getPlayer(): MeshView {
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
        if (!obj) { return; }

        switch(obj.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.deleteInstance((<MeshView> obj).mesh);
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
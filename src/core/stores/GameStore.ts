import { IGameModel } from '../models/game_objects/IGameModel';
import { RouteModel } from '../models/game_objects/RouteModel';
import { Registry } from '../Registry';
import { MeshView } from '../models/views/MeshView';
import { ConceptType, View } from '../models/views/View';
import { AbstractStore } from './AbstractStore';

export class GameStore extends AbstractStore {
    private nameToObjMap: Map<string, IGameModel> = new Map();
    private registry: Registry;

    objs: IGameModel[] = [];

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    getEnemies(): MeshView[] {
        return <MeshView[]> this.objs.filter(gameObject => gameObject.id === 'enemy');
    }

    add(gameObject: IGameModel) {
        super.addItem(gameObject);
        this.objs.push(gameObject);
        this.nameToObjMap.set(gameObject.id, gameObject);
    }

    addItem(model: IGameModel) {
        super.addItem(model);
        this.objs.push(model);
    }

    getByName<T extends IGameModel>(name: string): T {
        return <T> this.nameToObjMap.get(name);
    }

    getMeshObjects(): MeshView[] {
        return <MeshView[]> this.objs.filter(obj => obj.type === ConceptType.MeshConcept);
    }

    getPlayer(): MeshView {
        return this.getMeshObjects().find(obj => obj.isManualControl);
    }

    getRouteById(id: string): RouteModel {
        return <RouteModel> this.nameToObjMap.get(id);
    }

    getRouteModels(): RouteModel[] {
        return <RouteModel[]> this.objs.filter(obj => obj.type === ConceptType.RouteConcept);
    }

    // getItemsByType(type: string): View[] {
    //     if (isControl(type)) {
    //         return this.controls.filter(c => c.type === type);
    //     } else if (isConcept(type)) {
    //         return this.views.filter(v => v.type === type);
    //     }
    // }

    removeItem(obj: View) {
        if (!obj) { return; }
        super.removeItem(obj);

        switch(obj.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.deleteInstance((<MeshView> obj).mesh);
            break;
        }

        this.nameToObjMap.delete(obj.id);
        this.objs = this.objs.filter(o => o.id !== obj.id);
    }

    clear(): void {
        super.clear();
        this.objs = [];
        this.registry.stores.meshStore.clear();
    }

    isEmpty(): boolean {
        return this.objs.length === 0;
    }
}
import { Registry } from "../Registry";
import { RouteModel } from "./game_objects/RouteModel";
import { AbstractStore } from "./AbstractStore";
import { IGameModel } from "./game_objects/IGameModel";

export class GameStore extends AbstractStore {
    static id = 'game-store'; 
    id = GameStore.id;

    private registry: Registry;

    private routes: RouteModel[] = [];
    private routeMap: Map<string, RouteModel> = new Map();

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addRoute(routeModel: RouteModel) {
        routeModel.id = routeModel.id === undefined ? this.generateUniqueName(routeModel.viewType) : routeModel.id;
        this.routes.push(routeModel);
        this.routeMap.set(routeModel.id, routeModel);
    }

    getRoutes(): RouteModel[] {
        return this.routes;
    }

    byId<T extends IGameModel>(id: string): T {
        return <T> (<IGameModel> this.routeMap.get(id));
    }

    clear() {
        this.routes = [];
        this.routeMap = new Map();
        this.registry.stores.meshStore.clear();
    }
}
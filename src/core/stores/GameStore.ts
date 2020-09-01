import { Registry } from "../Registry";
import { RouteModel } from "../models/game_objects/RouteModel";
import { AbstractStore } from "./AbstractStore";
import { IGameModel } from "../models/game_objects/IGameModel";

export class GameStore extends AbstractStore<any> {
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
        routeModel.id = routeModel.id === undefined ? this.generateId(routeModel.viewType) : routeModel.id;
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
        this.registry.engine.meshLoader.clear();
    }
}
import { Registry } from "../../../core/Registry";
import { RouteWalker } from "./RouteWalker";

export class Walkers {
    private registry: Registry;
    private routeWalker: RouteWalker;

    constructor(registry: Registry) {
        this.registry = registry;
        this.routeWalker = new RouteWalker();
    }

    walk() {
        this.registry.stores.gameStore.getRouteObjects().forEach(route => this.routeWalker.walk(route));
    }
}
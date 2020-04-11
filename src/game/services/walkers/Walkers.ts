import { RouteWalker } from "./RouteWalker";
import { Stores } from "../../../editor/stores/Stores";

export class Walkers {
    private getStores: () => Stores;
    private routeWalker: RouteWalker;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
        this.routeWalker = new RouteWalker();
    }

    walk() {
        this.getStores().gameStore.getRouteObjects().forEach(route => this.routeWalker.walk(route));
    }
}
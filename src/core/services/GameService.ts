import { RouteModel } from "../models/game_objects/RouteModel";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";

export class GameService {
    serviceName = 'game-service';
    
    private afterRenders: (() => void)[] = [];

    viewImporter: ImportService;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    resetPath(meshObjectName: string) {
        const route = this.registry.stores.gameStore.byId<RouteModel>(meshObjectName);
        route.reset();
    }

    // updateConcepts(concepts: View[]) {
    //     this.deleteConcepts(concepts);

    //     concepts.forEach(concept => this.addConcept(concept))
    // }

    registerAfterRender(callback: () => void) {
        this.afterRenders.push(callback);
    }
}
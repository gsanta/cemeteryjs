import { MeshView } from "../models/views/MeshView";
import { ViewType, View } from "../models/views/View";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";
import { MeshLoaderService } from "./MeshLoaderService";
import { RouteModel } from "../models/game_objects/RouteModel";

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

    // importAllConcepts() {
    //     this.registry.stores.gameStore.clear();
    //     const meshLoaderService = this.registry.plugins.gameView.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);

    //     meshLoaderService.clear();

    //     meshLoaderService.loadAll(this.registry.stores.gameStore.getMeshObjects())
    //         .then(() => {
    //             this.registry.stores.gameStore.getMeshObjects().forEach(meshObject => this.registry.stores.meshStore.createInstance(meshObject.model));
    //         });
    // }

    // deleteConcepts(concepts: View[]) {
    //     concepts.forEach(concept => this.registry.stores.gameStore.removeItem(concept));
    // }

    addConcept(view: View) {
        switch(view.viewType) {
            case ViewType.MeshView:
                this.registry.stores.meshStore.createInstance((<MeshView> view).obj)
            break;
        }
    }

    // updateConcepts(concepts: View[]) {
    //     this.deleteConcepts(concepts);

    //     concepts.forEach(concept => this.addConcept(concept))
    // }

    registerAfterRender(callback: () => void) {
        this.afterRenders.push(callback);
    }
}
import { MeshView } from "../models/views/MeshView";
import { ConceptType, View } from "../models/views/View";
import { Registry } from "../Registry";
import { IConceptConverter } from "./convert/IConceptConverter";
import { ImportService } from "./import/ImportService";

export class GameService {
    serviceName = 'game-service';
    
    private afterRenders: (() => void)[] = [];

    viewImporter: ImportService;
    viewConverters: IConceptConverter[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    resetPath(meshObjectName: string) {
        const route = this.registry.stores.gameStore.getRouteById(meshObjectName);
        route.reset();
    }

    importAllConcepts() {
        this.registry.stores.gameStore.clear();
        this.registry.services.meshLoader.clear();

        this.registry.stores.canvasStore.getAllConcepts().forEach(concept => this.registry.services.conceptConverter.convert(concept));

        this.registry.services.meshLoader.loadAll(this.registry.stores.gameStore.getMeshObjects())
            .then(() => {
                this.registry.stores.gameStore.getMeshObjects().forEach(meshObject => this.registry.stores.meshStore.createInstance(meshObject.model));
            });
    }

    deleteConcepts(concepts: View[]) {
        concepts.forEach(concept => this.registry.stores.gameStore.removeItem(concept));
    }

    addConcept(concept: View) {
        const gameObject = this.registry.services.conceptConverter.convert(concept);

        switch(gameObject.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.createInstance((<MeshView> gameObject).model)
            break;
        }
    }

    updateConcepts(concepts: View[]) {
        this.deleteConcepts(concepts);

        concepts.forEach(concept => this.addConcept(concept))
    }

    registerAfterRender(callback: () => void) {
        this.afterRenders.push(callback);
    }
}
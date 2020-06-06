import { Engine } from "babylonjs";
import { Scene } from "babylonjs/scene";
import { GameEngine } from "../../plugins/game_viewer/GameEngine";
import { MeshView } from "../models/views/MeshView";
import { ConceptType, View } from "../models/views/View";
import { Registry } from "../Registry";
import { IConceptConverter } from "./convert/IConceptConverter";
import { ImportService } from "./import/ImportService";

export class GameService {
    serviceName = 'game-service';
    gameEngine: GameEngine;
    
    private afterRenders: (() => void)[] = [];

    viewImporter: ImportService;
    viewConverters: IConceptConverter[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    init(canvas: HTMLCanvasElement) {
        this.gameEngine = new GameEngine();
        this.gameEngine.init(canvas);

        this.gameEngine.scene.registerAfterRender(() => {
            this.afterRenders.forEach(callback => callback());
        });

        // this.walkers = new Walkers(this.registry);    
    }

    destroy() {
        this.getEngine().dispose();
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
                this.registry.stores.gameStore.getMeshObjects().forEach(meshObject => this.registry.stores.meshStore.createInstance(meshObject.model, this.registry.services.game.getScene()));
            });
    }

    deleteConcepts(concepts: View[]) {
        concepts.forEach(concept => this.registry.stores.gameStore.removeItem(concept));
    }

    addConcept(concept: View) {
        const gameObject = this.registry.services.conceptConverter.convert(concept);

        switch(gameObject.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.createInstance((<MeshView> gameObject).model, this.registry.services.game.getScene())
            break;
        }
    }

    updateConcepts(concepts: View[]) {
        this.deleteConcepts(concepts);

        concepts.forEach(concept => this.addConcept(concept))
    }

    getEngine(): Engine {
        return this.gameEngine.engine;
    }

    getScene(): Scene {
        return this.gameEngine.scene;
    }

    registerAfterRender(callback: () => void) {
        this.afterRenders.push(callback);
    }

    getDeltaTime(): number {
        return this.gameEngine.engine.getDeltaTime();
    }
}
import { Engine } from "babylonjs";
import { Scene } from "babylonjs/scene";
import { CharacterMovement } from "../../game/services/behaviour/CharacterMovement";
import { GameEventManager, GamepadEvent } from "../../game/services/GameEventManager";
import { PlayerListener } from "../../game/services/listeners/PlayerListener";
import { AfterRenderTrigger } from "../../game/services/triggers/AfterRenderTrigger";
import { KeyboardTrigger } from "../../game/services/triggers/KeyboardTrigger";
import { GameEngine } from "../../plugins/game_viewer/GameEngine";
import { MeshView } from "../models/views/MeshView";
import { ConceptType, View } from "../models/views/View";
import { Registry } from "../Registry";
import { IConceptConverter } from "./convert/IConceptConverter";
import { IConceptImporter } from "./import/IConceptImporter";
import { ImportService } from "./import/ImportService";

export class GameService {
    serviceName = 'game-service';
    gameEngine: GameEngine;
    
    private keyboardTrigger: KeyboardTrigger;
    private afterRenderTrigger: AfterRenderTrigger;
    private afterRenders: (() => void)[] = [];
    gameEventManager: GameEventManager;
    characterMovement: CharacterMovement;

    importers: IConceptImporter[];
    viewImporter: ImportService;
    viewConverters: IConceptConverter[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    init(canvas: HTMLCanvasElement) {
        this.gameEngine = new GameEngine();
        this.gameEngine.init(canvas);
        this.gameEventManager = new GameEventManager();
        this.characterMovement = new CharacterMovement(this.registry);

        const playerListener = new PlayerListener(this.registry);
        this.gameEventManager.listeners.registerGamepadListener((gamepadEvent: GamepadEvent) => playerListener.gamepadEvent(gamepadEvent));
        this.keyboardTrigger = new KeyboardTrigger(this.registry);
        this.afterRenderTrigger = new AfterRenderTrigger(this.registry)

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
                this.registry.stores.gameStore.getMeshObjects().forEach(meshObject => this.registry.stores.meshStore.createInstance(meshObject, this.registry.services.game.getScene()));
            });
    }

    deleteConcepts(concepts: View[]) {
        concepts.forEach(concept => this.registry.stores.gameStore.removeItem(concept));
    }

    addConcept(concept: View) {
        const gameObject = this.registry.services.conceptConverter.convert(concept);

        switch(gameObject.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.createInstance(<MeshView> gameObject, this.registry.services.game.getScene())
            break;
        }
    }

    updateConcepts(concepts: View[]) {
        this.deleteConcepts(concepts);

        concepts.forEach(concept => this.addConcept(concept))
    }

    playerAction(gamepadEvent: GamepadEvent[]) {
        this.characterMovement.action(gamepadEvent);
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
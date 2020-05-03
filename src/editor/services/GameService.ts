import { Engine } from "babylonjs";
import { Scene } from "babylonjs/scene";
import { CharacterMovement } from "../../game/services/behaviour/CharacterMovement";
import { GameEventManager, GamepadEvent } from "../../game/services/GameEventManager";
import { AnimationPlayer } from "../../game/services/listeners/AnimationPlayer";
import { PlayerListener } from "../../game/services/listeners/PlayerListener";
import { AfterRenderTrigger } from "../../game/services/triggers/AfterRenderTrigger";
import { KeyboardTrigger } from "../../game/services/triggers/KeyboardTrigger";
import { Walkers } from "../../game/services/walkers/Walkers";
import { Registry } from "../Registry";
import { Concept, ConceptType } from "../models/concepts/Concept";
import { GameEngine } from "../views/renderer/GameEngine";
import { IConceptConverter } from "./convert/IConceptConverter";
import { IConceptImporter } from "./import/IConceptImporter";
import { ImportService } from "./import/ImportService";
import { MeshConcept } from "../models/concepts/MeshConcept";

export class GameService {
    serviceName = 'game-service';
    gameEngine: GameEngine;
    
    private keyboardTrigger: KeyboardTrigger;
    private afterRenderTrigger: AfterRenderTrigger;
    gameEventManager: GameEventManager;
    characterMovement: CharacterMovement;
    animationPlayer: AnimationPlayer;

    importers: IConceptImporter[];
    viewImporter: ImportService;
    viewConverters: IConceptConverter[] = [];

    private walkers: Walkers;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.registry.services.game = this; 
    }

    init(canvas: HTMLCanvasElement) {
        this.gameEngine = new GameEngine();
        this.gameEngine.init(canvas);
        this.gameEventManager = new GameEventManager();
        this.characterMovement = new CharacterMovement(this.registry);

        const playerListener = new PlayerListener(this.registry);
        this.gameEventManager.listeners.registerGamepadListener((gamepadEvent: GamepadEvent) => playerListener.gamepadEvent(gamepadEvent));
        this.gameEventManager.listeners.registerAfterRenderListener(() => this.walkers.walk());
        const animationPlayer = new AnimationPlayer(this.registry);
        this.gameEventManager.listeners.registerAfterRenderListener(() => animationPlayer.updateAnimations());
        this.keyboardTrigger = new KeyboardTrigger(this.registry);
        this.afterRenderTrigger = new AfterRenderTrigger(this.registry)

        this.walkers = new Walkers(this.registry);    
    }

    resetPath(meshObjectName: string) {
        const route = this.registry.stores.gameStore.getRouteById(meshObjectName);
        route.reset();
    }

    resetAllMovements() {
        this.registry.stores.gameStore.getRouteObjects().forEach(route => route.reset());
    }

    pauseMovement(meshObjectName: string) {
        const route = this.registry.stores.gameStore.getRouteById(meshObjectName);
        route.isPaused = true;
    }

    pauseAllMovements() {
        this.registry.stores.gameStore.getRouteObjects().forEach(route => route.isPaused = true);
    }

    playMovement(meshObjectName: string) {
        const route = this.registry.stores.gameStore.getRouteById(meshObjectName);
        route.isPaused = false;
    }

    playAllMovements() {
        this.registry.stores.gameStore.getRouteObjects().forEach(route => route.isPaused = false);
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

    deleteConcepts(concepts: Concept[]) {
        concepts.forEach(concept => this.registry.stores.gameStore.deleteById(concept.id));
    }

    addConcept(concept: Concept) {
        const gameObject = this.registry.services.conceptConverter.convert(concept);

        switch(gameObject.type) {
            case ConceptType.MeshConcept:
                this.registry.stores.meshStore.createInstance(<MeshConcept> gameObject, this.registry.services.game.getScene())
            break;
        }
    }

    updateConcepts(concepts: Concept[]) {
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
}
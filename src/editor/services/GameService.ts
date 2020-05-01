import { Scene } from "babylonjs/scene";
import { MeshObject } from "../../game/models/objects/MeshObject";
import { Stores } from "../stores/Stores";
import { Concept, ConceptType } from "../views/canvas/models/concepts/Concept";
import { GameEngine } from "../views/renderer/GameEngine";
import { ServiceLocator } from "./ServiceLocator";
import { KeyboardTrigger } from "../../game/services/triggers/KeyboardTrigger";
import { AfterRenderTrigger } from "../../game/services/triggers/AfterRenderTrigger";
import { GamepadEvent, GameEventManager } from "../../game/services/GameEventManager";
import { CharacterMovement } from "../../game/services/behaviour/CharacterMovement";
import { AnimationPlayer } from "../../game/services/listeners/AnimationPlayer";
import { IConceptImporter } from "./import/IConceptImporter";
import { ImportService } from "./import/ImportService";
import { IConceptConverter } from "./convert/IConceptConverter";
import { Walkers } from "../../game/services/walkers/Walkers";
import { PlayerListener } from "../../game/services/listeners/PlayerListener";
import { Engine } from "babylonjs";
import { Registry } from "../Registry";

export class GameService {
    serviceName = 'game-service';
    gameEngine: GameEngine;
    
    private keyboardListener: KeyboardTrigger;
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
        this.keyboardListener = new KeyboardTrigger(this.registry);
        this.keyboardTrigger = new KeyboardTrigger(this.registry);
        this.gameEventManager = new GameEventManager();
        this.characterMovement = new CharacterMovement();

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
        this.registry.stores.gameStore.getByName<MeshObject>(meshObjectName).getRoute().reset();
    }

    resetAllMovements() {
        this.registry.stores.gameStore.getRouteObjects().forEach(route => route.reset());
    }

    pauseMovement(meshObjectName: string) {
        this.registry.stores.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
    }

    pauseAllMovements() {
        this.registry.stores.gameStore.getRouteObjects().forEach(route => route.isPaused = true);
    }

    playMovement(meshObjectName: string) {
        this.registry.stores.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = false;
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
                const meshObject = <MeshObject> gameObject;
                if (!meshObject.modelPath) {
                    this.registry.stores.meshStore.createInstance(meshObject, this.registry.services.game.getScene());
                } else {
                    this.registry.services.meshLoader.load(meshObject.modelPath, meshObject.id)
                        .then(() => this.registry.stores.meshStore.createInstance(meshObject, this.registry.services.game.getScene()));
                }
            break;
        }
    }

    updateConcepts(concepts: Concept[]) {
        this.deleteConcepts(concepts);

        concepts.forEach(concept => this.addConcept(concept))
    }

    getEngine(): Engine {
        return this.gameEngine.engine;
    }

    getScene(): Scene {
        return this.gameEngine.scene;
    }
}
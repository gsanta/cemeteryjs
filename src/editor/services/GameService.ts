import { Scene } from "babylonjs/scene";
import { GameObjectType } from "../../game/models/objects/IGameObject";
import { MeshObject } from "../../game/models/objects/MeshObject";
import { Stores } from "../stores/Stores";
import { Concept } from "../views/canvas/models/concepts/Concept";
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
    
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(canvas: HTMLCanvasElement, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;

        this.getServices().game = this;
        
        this.gameEngine = new GameEngine(canvas);
        this.keyboardListener = new KeyboardTrigger(getServices);
        this.keyboardTrigger = new KeyboardTrigger(getServices);
        this.gameEventManager = new GameEventManager();
        this.characterMovement = new CharacterMovement();

        const playerListener = new PlayerListener(getServices, this.getStores);
        this.gameEventManager.listeners.registerGamepadListener((gamepadEvent: GamepadEvent) => playerListener.gamepadEvent(gamepadEvent));
        this.gameEventManager.listeners.registerAfterRenderListener(() => this.walkers.walk());
        const animationPlayer = new AnimationPlayer(getServices, this.getStores);
        this.gameEventManager.listeners.registerAfterRenderListener(() => animationPlayer.updateAnimations());
        this.keyboardTrigger = new KeyboardTrigger(getServices);
        this.afterRenderTrigger = new AfterRenderTrigger(getServices)

        this.walkers = new Walkers(this.getStores);     
    }

    resetPath(meshObjectName: string) {
        this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().reset();
    }

    resetAllMovements() {
        this.getStores().gameStore.getRouteObjects().forEach(route => route.reset());
    }

    pauseMovement(meshObjectName: string) {
        this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
    }

    pauseAllMovements() {
        this.getStores().gameStore.getRouteObjects().forEach(route => route.isPaused = true);
    }

    playMovement(meshObjectName: string) {
        this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = false;
    }

    playAllMovements() {
        this.getStores().gameStore.getRouteObjects().forEach(route => route.isPaused = false);
    }

    importAllConcepts() {
        this.getStores().gameStore.clear();
        this.getServices().meshLoader.clear();

        this.getStores().canvasStore.getAllConcepts().forEach(concept => this.getServices().conceptConverter.convert(concept));

        this.getServices().meshLoader.loadAll(this.getStores().gameStore.getMeshObjects())
            .then(() => {
                this.getStores().gameStore.getMeshObjects().forEach(meshObject => this.getStores().meshStore.createInstance(meshObject, this.getServices().game.getScene()));
            });
    }

    deleteConcepts(concepts: Concept[]) {
        concepts.forEach(concept => this.getStores().gameStore.deleteById(concept.id));
    }

    addConcept(concept: Concept) {
        const gameObject = this.getServices().conceptConverter.convert(concept);

        switch(gameObject.objectType) {
            case GameObjectType.MeshObject:
                const meshObject = <MeshObject> gameObject;
                if (!meshObject.modelPath) {
                    this.getStores().meshStore.createInstance(meshObject, this.getServices().game.getScene());
                } else {
                    this.getServices().meshLoader.load(meshObject.modelPath, meshObject.id)
                        .then(() => this.getStores().meshStore.createInstance(meshObject, this.getServices().game.getScene()));
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
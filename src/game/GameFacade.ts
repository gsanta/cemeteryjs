import { ImportService } from '../editor/services/import/ImportService';
import { IConceptImporter } from '../editor/services/import/IConceptImporter';
import { GameEngine } from '../editor/views/renderer/GameEngine';
import { CreateMeshModifier } from './import/CreateMeshModifier';
import { GameObjectFactory } from './import/GameObjectFactory';
import { IViewConverter } from './models/objects/IViewConverter';
import { MeshObject } from './models/objects/MeshObject';
import { MeshConceptConverter } from './models/objects/MeshConceptConverter';
import { PathConceptConverter } from './models/objects/PathConceptConverter';
import { GameStore } from './models/stores/GameStore';
import { GameStoreBuilder } from './models/stores/GameStoreBuilder';
import { MeshStore } from './models/stores/MeshStore';
import { CharacterMovement } from './services/behaviour/CharacterMovement';
import { EnemyBehaviourManager } from './services/behaviour/EnemyBehaviourManager';
import { WanderBehaviour } from './services/behaviour/WanderBehaviour';
import { GameEventManager, GameEventListener, GamepadEvent } from './services/GameEventManager';
import { GameModelLoader } from './services/GameModelLoader';
import { AnimationPlayer } from './services/listeners/AnimationPlayer';
import { PlayerListener } from './services/listeners/PlayerListener';
import { AfterRenderTrigger } from './services/triggers/AfterRenderTrigger';
import { KeyboardTrigger } from './services/triggers/KeyboardTrigger';
import { ResetTrigger } from './services/triggers/ResetTrigger';
import { RouteWalker } from './services/walkers/RouteWalker';
import { InputCommandStore } from './stores/InputCommandStore';
import { ServiceLocator } from '../editor/services/ServiceLocator';
import { Stores } from '../editor/stores/Stores';
import { Walkers } from './services/walkers/Walkers';

export class GameFacade {
    gameEngine: GameEngine;
    meshStore: MeshStore;
    gameStore: GameStore;
    inputCommandStore: InputCommandStore;

    modelLoader: GameModelLoader;
    private keyboardListener: KeyboardTrigger;
    private keyboardTrigger: KeyboardTrigger;
    gameEventManager: GameEventManager;
    characterMovement: CharacterMovement;
    animationPlayer: AnimationPlayer;

    gameObjectFactory: GameObjectFactory;

    importers: IConceptImporter[];
    viewImporter: ImportService;
    viewConverters: IViewConverter[] = [];

    gameStoreBuilder: GameStoreBuilder;

    private walkers: Walkers;
    services: ServiceLocator;
    stores: Stores;

    constructor(canvas: HTMLCanvasElement, services: ServiceLocator) {
        this.services = services;
        this.stores = new Stores();
        this.gameEngine = new GameEngine(canvas);
        this.meshStore = new MeshStore(this);
        this.gameStore = new GameStore();
        this.inputCommandStore = new InputCommandStore();

        this.modelLoader = new GameModelLoader(this);
        this.keyboardListener = new KeyboardTrigger(this);
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.gameEventManager = new GameEventManager(this);
        this.characterMovement = new CharacterMovement();

        const playerListener = new PlayerListener(this);
        this.gameEventManager.listeners.registerGamepadListener((gamepadEvent: GamepadEvent) => playerListener.gamepadEvent(gamepadEvent));
        const routeWalker = new RouteWalker();
        // this.gameEventManager.registerListener(new EnemyBehaviourManager(this, [new WanderBehaviour()]));
        this.gameEventManager.listeners.registerAfterRenderListener(() => this.walkers.walk());
        const animationPlayer = new AnimationPlayer(this);
        this.gameEventManager.listeners.registerAfterRenderListener(() => animationPlayer.updateAnimations());
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.gameEventManager.registerLifeCycleTrigger(new AfterRenderTrigger(this));
        this.gameEventManager.registerLifeCycleTrigger(new ResetTrigger(this));

        this.gameObjectFactory = new GameObjectFactory(this);
        this.gameStoreBuilder = new GameStoreBuilder(this, () => this.services, () => this.stores);
        

        this.viewConverters = [
            new MeshConceptConverter(this, () => this.stores),
            new PathConceptConverter(this)
        ]
    }
    
    setup() {
    }

    clear(): void {
        this.meshStore.clear();
        this.stores.canvasStore.clear();
        this.modelLoader.clear();
    }
    
    generateWorld(worldMap: string): Promise<MeshObject[]> {
        this.meshStore.clear();
        this.modelLoader.clear();
        this.gameStore.clear();
        // this.gameObjectBuilder.build(worldMap);
        this.gameStoreBuilder.build(worldMap);

        return this.modelLoader.loadAll(this.gameStore.getMeshObjects()).then(
            () => {
                new CreateMeshModifier(this.gameEngine.scene, this).apply(this.gameStore.getMeshObjects())
                this.routeWalker.start();
                // this.routeWalker.initRoutes();

                return this.gameStore.getMeshObjects();
            }
        )
    }
}
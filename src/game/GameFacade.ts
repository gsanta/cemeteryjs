import { IConceptImporter } from '../editor/services/import/IConceptImporter';
import { ImportService } from '../editor/services/import/ImportService';
import { ServiceLocator } from '../editor/services/ServiceLocator';
import { Stores } from '../editor/stores/Stores';
import { GameEngine } from '../editor/views/renderer/GameEngine';
import { IConceptConverter } from '../editor/services/convert/IConceptConverter';
import { MeshStore } from './models/stores/MeshStore';
import { CharacterMovement } from './services/behaviour/CharacterMovement';
import { GameEventManager, GamepadEvent } from './services/GameEventManager';
import { AnimationPlayer } from './services/listeners/AnimationPlayer';
import { PlayerListener } from './services/listeners/PlayerListener';
import { AfterRenderTrigger } from './services/triggers/AfterRenderTrigger';
import { KeyboardTrigger } from './services/triggers/KeyboardTrigger';
import { Walkers } from './services/walkers/Walkers';

export class GameFacade {
    gameEngine: GameEngine;
    meshStore: MeshStore;

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
    services: ServiceLocator;
    stores: Stores;

    constructor(canvas: HTMLCanvasElement, services: ServiceLocator) {
        this.services = services;
        this.stores = new Stores();
        this.gameEngine = new GameEngine(canvas);
        this.meshStore = new MeshStore();

        this.keyboardListener = new KeyboardTrigger(this);
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.gameEventManager = new GameEventManager();
        this.characterMovement = new CharacterMovement();

        const playerListener = new PlayerListener(this);
        this.gameEventManager.listeners.registerGamepadListener((gamepadEvent: GamepadEvent) => playerListener.gamepadEvent(gamepadEvent));
        // this.gameEventManager.registerListener(new EnemyBehaviourManager(this, [new WanderBehaviour()]));
        this.gameEventManager.listeners.registerAfterRenderListener(() => this.walkers.walk());
        const animationPlayer = new AnimationPlayer(this);
        this.gameEventManager.listeners.registerAfterRenderListener(() => animationPlayer.updateAnimations());
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.afterRenderTrigger = new AfterRenderTrigger(this)

        this.walkers = new Walkers(() => this.stores);        
    }
    
    setup() {
    }

    // clear(): void {
    //     this.meshStore.clear();
    //     this.stores.canvasStore.clear();
    //     this.modelLoader.clear();
    // }
    
    // generateWorld(worldMap: string): Promise<MeshObject[]> {
    //     this.meshStore.clear();
    //     this.modelLoader.clear();
    //     this.stores.gameStore.clear();
    //     // this.gameObjectBuilder.build(worldMap);
    //     this.gameStoreBuilder.build(worldMap);

    //     return this.modelLoader.loadAll(this.stores.gameStore.getMeshObjects()).then(
    //         () => {
    //             new CreateMeshModifier(this.gameEngine.scene, this).apply(this.stores.gameStore.getMeshObjects())
    //             // this.routeWalker.initRoutes();

    //             return this.stores.gameStore.getMeshObjects();
    //         }
    //     )
    // }
}
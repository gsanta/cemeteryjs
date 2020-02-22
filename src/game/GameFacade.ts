import { ViewImporter } from '../common/importers/ViewImporter';
import { IViewImporter } from '../editor/controllers/windows/canvas/tools/IToolImporter';
import { GameEngine } from '../editor/controllers/windows/renderer/GameEngine';
import { CreateMeshModifier } from './import/CreateMeshModifier';
import { GameObjectFactory } from './import/GameObjectFactory';
import { IViewConverter } from './models/objects/IViewConverter';
import { MeshObject } from './models/objects/MeshObject';
import { MeshViewConverter } from './models/objects/MeshViewConverter';
import { PathViewConverter } from './models/objects/PathViewConverter';
import { GameStore } from './models/stores/GameStore';
import { GameStoreBuilder } from './models/stores/GameStoreBuilder';
import { MeshStore } from './models/stores/MeshStore';
import { CharacterMovement } from './services/behaviour/CharacterMovement';
import { EnemyBehaviourManager } from './services/behaviour/EnemyBehaviourManager';
import { WanderBehaviour } from './services/behaviour/WanderBehaviour';
import { GameEventManager } from './services/GameEventManager';
import { GameModelLoader } from './services/GameModelLoader';
import { AnimationPlayer } from './services/listeners/AnimationPlayer';
import { PlayerListener } from './services/listeners/PlayerListener';
import { AfterRenderTrigger } from './services/triggers/AfterRenderTrigger';
import { KeyboardTrigger } from './services/triggers/KeyboardTrigger';
import { ResetTrigger } from './services/triggers/ResetTrigger';
import { RouteWalker } from './services/walkers/RouteWalker';
import { InputCommandStore } from './stores/InputCommandStore';

export class GameFacade {
    gameEngine: GameEngine;
    meshStore: MeshStore;
    gameStore: GameStore;
    inputCommandStore: InputCommandStore;

    modelLoader: GameModelLoader;
    private keyboardListener: KeyboardTrigger;
    private keyboardTrigger: KeyboardTrigger;
    private gameEventManager: GameEventManager;
    characterMovement: CharacterMovement;
    animationPlayer: AnimationPlayer;

    gameObjectFactory: GameObjectFactory;

    importers: IViewImporter[];
    viewImporter: ViewImporter;
    viewConverters: IViewConverter[] = [];

    gameStoreBuilder: GameStoreBuilder;

    private routeWalker: RouteWalker;

    constructor(canvas: HTMLCanvasElement) {
        this.gameEngine = new GameEngine(canvas);
        this.meshStore = new MeshStore(this);
        this.gameStore = new GameStore();
        this.inputCommandStore = new InputCommandStore();

        this.modelLoader = new GameModelLoader(this);
        this.keyboardListener = new KeyboardTrigger(this);
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.gameEventManager = new GameEventManager(this);
        this.characterMovement = new CharacterMovement();

        this.gameEventManager.registerListener(new PlayerListener());
        this.gameEventManager.registerListener(new EnemyBehaviourManager(this, [new WanderBehaviour()]));
        this.routeWalker = new RouteWalker(this);
        this.gameEventManager.registerListener(this.routeWalker);
        this.gameEventManager.registerListener(new AnimationPlayer(this));
        this.gameEventManager.registerTrigger(new KeyboardTrigger(this));
        this.gameEventManager.registerLifeCycleTrigger(new AfterRenderTrigger(this));
        this.gameEventManager.registerLifeCycleTrigger(new ResetTrigger(this));

        this.gameObjectFactory = new GameObjectFactory(this);
        this.gameStoreBuilder = new GameStoreBuilder(this);
        

        this.viewConverters = [
            new MeshViewConverter(this),
            new PathViewConverter(this)
        ]
    }
    
    setup() {
    }

    clear(): void {
        this.meshStore.clear();
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

                this.routeWalker.initRoutes();

                return this.gameStore.getMeshObjects();
            }
        )
    }
}
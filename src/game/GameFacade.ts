import { Scene, OnAfterEnteringVRObservableEvent } from 'babylonjs';
import { ViewImporter } from '../common/importers/ViewImporter';
import { IViewImporter } from '../editor/controllers/canvases/svg/tools/IToolImporter';
import { CreateMeshModifier } from './import/CreateMeshModifier';
import { GameObjectFactory } from './import/GameObjectFactory';
import { IViewConverter } from './models/objects/IViewConverter';
import { MeshObject } from './models/objects/MeshObject';
import { MeshViewConverter } from './models/objects/MeshViewConverter';
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
import { KeyboardTrigger } from './services/triggers/KeyboardTrigger';
import { AfterRenderTrigger } from './services/triggers/AfterRenderTrigger';
import { ResetTrigger } from './services/triggers/ResetTrigger';
import { InputCommandStore } from './stores/InputCommandStore';
import { PathViewConverter } from './models/objects/PathViewConverter';
import { RouteWalker } from './services/walkers/RouteWalker';

export class GameFacade {
    meshStore: MeshStore;
    gameStore: GameStore;
    inputCommandStore: InputCommandStore;

    modelLoader: GameModelLoader;
    keyboardListener: KeyboardTrigger;
    keyboardTrigger: KeyboardTrigger;
    gameEventManager: GameEventManager;
    characterMovement: CharacterMovement;
    animationPlayer: AnimationPlayer;

    gameObjectFactory: GameObjectFactory;

    importers: IViewImporter[];
    viewImporter: ViewImporter;
    viewConverters: IViewConverter[] = [];

    gameStoreBuilder: GameStoreBuilder;

    scene: Scene;

    private routeWalker: RouteWalker;

    constructor(scene: Scene) {
        this.scene = scene;
        this.meshStore = new MeshStore(this);
        this.gameStore = new GameStore();
        this.inputCommandStore = new InputCommandStore();

        this.modelLoader = new GameModelLoader(scene, this);
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
        // this.gameObjectBuilder.build(worldMap);
        this.gameStoreBuilder.build(worldMap);
        this.routeWalker.initRoutes();

        return this.modelLoader.loadAll(this.gameStore.getMeshObjects()).then(
            () => {
                new CreateMeshModifier(this.scene, this).apply(this.gameStore.getMeshObjects())

                return this.gameStore.getMeshObjects();
            }
        )
    }
}
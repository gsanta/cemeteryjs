import { MeshStore } from './models/stores/MeshStore';
import { GameObjectStore } from './models/stores/GameObjectStore';
import { IWorldFacade } from '../common/IWorldFacade';
import { Mesh, Scene } from 'babylonjs';
import { GameModelLoader } from './services/GameModelLoader';
import { GameEventManager } from './services/GameEventManager';
import { KeyboardTrigger } from './services/triggers/KeyboardTrigger';
import { CharacterMovement } from './services/behaviour/CharacterMovement';
import { PlayerListener } from './services/listeners/PlayerListener';
import { InputCommandStore } from './stores/InputCommandStore';
import { LifecycleTrigger } from './services/triggers/LifecycleTrigger';
import { AnimationPlayer } from './services/listeners/AnimationPlayer';
import { EnemyBehaviourManager } from './services/behaviour/EnemyBehaviourManager';
import { WanderBehaviour } from './services/behaviour/WanderBehaviour';

export class GameFacade implements IWorldFacade<Mesh> {
    meshStore: MeshStore;
    gameObjectStore: GameObjectStore;
    inputCommandStore: InputCommandStore;

    modelLoader: GameModelLoader;
    keyboardListener: KeyboardTrigger;
    keyboardTrigger: KeyboardTrigger;
    gameEventManager: GameEventManager;
    characterMovement: CharacterMovement;
    animationPlayer: AnimationPlayer;

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.meshStore = new MeshStore(this);
        this.gameObjectStore = new GameObjectStore();
        this.inputCommandStore = new InputCommandStore();

        this.modelLoader = new GameModelLoader(scene, this);
        this.keyboardListener = new KeyboardTrigger(this);
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.gameEventManager = new GameEventManager(this);
        this.characterMovement = new CharacterMovement();

        this.gameEventManager.registerListener(new PlayerListener());
        this.gameEventManager.registerListener(new EnemyBehaviourManager(this, [new WanderBehaviour()]));
        this.gameEventManager.registerListener(new AnimationPlayer(this));
        this.gameEventManager.registerTrigger(new KeyboardTrigger(this));
        this.gameEventManager.registerTrigger(new LifecycleTrigger(this));
    }
    
    setup() {
    }

    clear(): void {
        this.gameObjectStore.gameObjects = [];
        this.meshStore.clear();
        this.modelLoader.clear();
    }
}
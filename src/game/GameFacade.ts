import { MeshStore } from './models/stores/MeshStore';
import { GameObjectStore } from './models/stores/GameObjectStore';
import { IWorldFacade } from '../common/IWorldFacade';
import { Mesh, Scene } from 'babylonjs';
import { GameModelLoader } from './services/GameModelLoader';
import { GameEventManager } from './services/GameEventManager';
import { KeyboardTrigger } from './services/triggers/KeyboardTrigger';
import { PlayerMovement } from './services/behaviour/PlayerMovement';
import { PlayerListener } from './services/listeners/PlayerListener';
import { InputCommandStore } from './stores/InputCommandStore';
import { LifecycleTrigger } from './services/triggers/LifecycleTrigger';

export class GameFacade implements IWorldFacade<Mesh> {
    meshStore: MeshStore;
    gameObjectStore: GameObjectStore;
    inputCommandStore: InputCommandStore;

    modelLoader: GameModelLoader;
    keyboardListener: KeyboardTrigger;
    keyboardTrigger: KeyboardTrigger;
    gameEventManager: GameEventManager;
    playerMovement: PlayerMovement;
    playerListener: PlayerListener;

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
        this.playerMovement = new PlayerMovement(this);
        this.playerListener = new PlayerListener(this);

        this.gameEventManager.registerListener(new PlayerListener(this));
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
import { MeshStore } from './models/stores/MeshStore';
import { GameObjectStore } from './models/stores/GameObjectStore';
import { IWorldFacade } from '../common/IWorldFacade';
import { Mesh, Scene } from 'babylonjs';
import { GameModelLoader } from './services/GameModelLoader';
import { KeyboardListener } from './services/input/listeners/KeyboardListener';
import { GameEventManager } from './services/input/GameEventManager';
import { KeyboardTrigger } from './services/input/triggers/KeyboardTrigger';
import { PlayerMovement } from './services/behaviour/PlayerMovement';
import { PlayerListener } from './services/actions/PlayerListener';

export class GameFacade implements IWorldFacade<Mesh> {
    meshStore: MeshStore;
    gameObjectStore: GameObjectStore;
    modelLoader: GameModelLoader;
    keyboardListener: KeyboardListener;
    keyboardTrigger: KeyboardTrigger;
    gameEventManager: GameEventManager;
    playerMovement: PlayerMovement;
    playerListener: PlayerListener;

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.meshStore = new MeshStore(this);
        this.gameObjectStore = new GameObjectStore();

        this.modelLoader = new GameModelLoader(scene, this);
        this.keyboardListener = new KeyboardListener(this);
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.gameEventManager = new GameEventManager(this);
        this.playerMovement = new PlayerMovement(this);
        this.playerListener = new PlayerListener(this);

        this.gameEventManager.registerListener(this.playerListener);
    }
    
    setup() {
        this.keyboardTrigger.activate();
        this.keyboardTrigger.activate();
    }

    clear(): void {
        this.gameObjectStore.gameObjects = [];
        this.meshStore.clear();
        this.modelLoader.clear();
    }
}
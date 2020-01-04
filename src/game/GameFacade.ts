import { MeshStore } from './models/stores/MeshStore';
import { GameObjectStore } from './models/stores/GameObjectStore';
import { IWorldFacade } from '../common/IWorldFacade';
import { Mesh, Scene } from 'babylonjs';
import { GameModelLoader } from './services/GameModelLoader';
import { KeyboardListener } from './services/input/listeners/KeyboardListener';
import { InteractionManager } from './services/input/InteractionManager';
import { KeyboardTrigger } from './services/input/triggers/KeyboardTrigger';

export class GameFacade implements IWorldFacade<Mesh> {
    meshStore: MeshStore;
    gameObjectStore: GameObjectStore;
    modelLoader: GameModelLoader;
    keyboardListener: KeyboardListener;
    keyboardTrigger: KeyboardTrigger;
    interactionManager: InteractionManager;

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.meshStore = new MeshStore(this);
        this.gameObjectStore = new GameObjectStore();

        this.modelLoader = new GameModelLoader(scene, this);
        this.keyboardListener = new KeyboardListener(this);
        this.keyboardTrigger = new KeyboardTrigger(this);
        this.interactionManager = new InteractionManager(this);
    }

    setup() {
        this.keyboardTrigger.activate();
    }

    clear(): void {
        this.gameObjectStore.gameObjects = [];
        this.meshStore.clear();
        this.modelLoader.clear();
    }
}
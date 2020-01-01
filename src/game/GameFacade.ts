import { MeshStore } from './models/MeshStore';
import { GameObjectStore } from './models/GameObjectStore';
import { IWorldFacade } from '../common/IWorldFacade';
import { Mesh, Scene } from 'babylonjs';
import { GameModelLoader } from './services/GameModelLoader';

export class GameFacade implements IWorldFacade<Mesh> {
    meshStore: MeshStore;
    gameObjectStore: GameObjectStore;
    modelLoader: GameModelLoader;

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.meshStore = new MeshStore(this);
        this.gameObjectStore = new GameObjectStore();

        this.modelLoader = new GameModelLoader(scene, this);
    }

    clear(): void {
        this.gameObjectStore.gameObjects = [];
        this.meshStore.clear();
        this.modelLoader.clear();
    }
}
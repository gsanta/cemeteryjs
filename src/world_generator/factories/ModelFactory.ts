import { Scene, Space, Vector3 } from 'babylonjs';
import { GameFacade } from '../../game/GameFacade';
import { Rectangle } from '../../model/geometry/shapes/Rectangle';
import { GameObject } from '../services/GameObject';
import { MaterialFactory } from './MaterialFactory';
import { RectangleFactory } from './RectangleFactory';

export class ModelFactory {
    private scene: Scene;
    private gameFacade: GameFacade;

    constructor(scene: Scene, gameFacade: GameFacade) {
        this.scene = scene;
        this.gameFacade = gameFacade;
    }

    public createMesh(gameObject: GameObject): void {
        if (!gameObject.modelPath) {
            new RectangleFactory(this.scene, new MaterialFactory(this.scene), this.gameFacade, 0.1).createMesh(gameObject);
            return;
        }

        const meshName = this.gameFacade.modelLoader.createInstance(gameObject.modelPath);

        gameObject.meshName = meshName;
        const mesh = this.gameFacade.meshStore.getMesh(meshName);
        this.gameFacade.gameObjectStore.gameObjects.push(gameObject);

        mesh.isVisible = true;
        const scale = gameObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.rotationQuaternion = undefined;

        const rect = <Rectangle> gameObject.dimensions;
        const width = rect.getWidth();
        const depth = rect.getHeight();

        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        mesh.rotation.y = gameObject.rotation;
    }
}
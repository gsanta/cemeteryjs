import { Axis, Mesh, Scene, Space, Vector3 } from 'babylonjs';
import { Rectangle } from '../../model/geometry/shapes/Rectangle';
import { AbstractModelLoader } from '../../common/AbstractModelLoader';
import { GameObject } from '../services/GameObject';
import { MaterialFactory } from './MaterialFactory';
import { RectangleFactory } from './RectangleFactory';
import { GameFacade } from '../../game/GameFacade';

export class ModelFactory {
    private scene: Scene;
    private gameFacade: GameFacade;

    constructor(scene: Scene, gameFacade: GameFacade) {
        this.scene = scene;
        this.gameFacade = gameFacade;
    }

    public createMesh(gameObject: GameObject): void {
        if (!gameObject.modelFileName) {
            new RectangleFactory(this.scene, new MaterialFactory(this.scene), this.gameFacade, 0.1).createMesh(gameObject);
            return;
        }

        const meshName = this.gameFacade.modelLoader.createInstance(gameObject.modelFileName);

        gameObject.meshName = meshName;
        const mesh = this.gameFacade.meshStore.getMesh(meshName);
        this.gameFacade.gameObjectStore.gameObjects.push(gameObject);
        gameObject.frontVector = new Vector3(0, 0, -1);

        mesh.isVisible = true;
        const scale = gameObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.rotationQuaternion = undefined;
        // this.scene.beginAnimation(mesh, 0, 24, true);

        const rect = <Rectangle> gameObject.dimensions;
        const center = gameObject.dimensions.getBoundingCenter();
        const pivotPoint = new Vector3(center.x, 0, center.y);
        // mesh.setPivotPoint(pivotPoint);
        // mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);
        // mesh.translate(new Vector3(center.x, 0, center.y), 1);
        const width = rect.getWidth();
        const depth = rect.getHeight();

        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);
        mesh.rotation.y = gameObject.rotation;
    }
}
import { Scene, Space, Vector3 } from 'babylonjs';
import { GameFacade } from '../../GameFacade';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MaterialFactory } from './MaterialFactory';
import { RectangleFactory } from './RectangleFactory';
import { MeshObject } from '../../models/objects/MeshObject';

export class ModelFactory {
    private scene: Scene;
    private gameFacade: GameFacade;

    constructor(scene: Scene, gameFacade: GameFacade) {
        this.scene = scene;
        this.gameFacade = gameFacade;
    }

    public createMesh(meshObject: MeshObject): void {
        if (!meshObject.modelPath) {
            new RectangleFactory(this.scene, new MaterialFactory(this.scene), this.gameFacade, 0.1).createMesh(meshObject);
            return;
        }

        const meshName = this.gameFacade.modelLoader.createInstance(meshObject.modelPath, meshObject.name);

        meshObject.meshName = meshName;
        const mesh = this.gameFacade.meshStore.getMesh(meshName);
        this.gameFacade.gameStore.getMeshObjects().push(meshObject);

        mesh.isVisible = true;
        const scale = meshObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.rotationQuaternion = undefined;

        const rect = <Rectangle> meshObject.dimensions;
        const width = rect.getWidth();
        const depth = rect.getHeight();

        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        mesh.rotation.y = meshObject.rotation;
    }
}
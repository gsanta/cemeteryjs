import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Axis, Space, Skeleton } from 'babylonjs';
import { ModelLoader } from '../services/ModelLoader';
import { GameObject } from '../services/GameObject';
import { RectangleFactory } from './RectangleFactory';
import { MaterialFactory } from './MaterialFactory';
import { Rectangle } from '../../model/geometry/shapes/Rectangle';

export class ModelFactory {
    private scene: Scene;
    private modelLoader: ModelLoader;

    constructor(scene: Scene, modelLoader: ModelLoader) {
        this.modelLoader = modelLoader;
        this.scene = scene;
    }

    public createMesh(gameObject: GameObject): [Mesh, Skeleton] {
        if (!gameObject.modelFileName) {
            return new RectangleFactory(this.scene, new MaterialFactory(this.scene), 0.1).createMesh(gameObject);
        }

        const [mesh, skeleton] = this.modelLoader.createInstance(gameObject.modelFileName);

        mesh.isVisible = true;

        const rect = <Rectangle> gameObject.dimensions;
        const center = gameObject.dimensions.getBoundingCenter();
        const pivotPoint = new Vector3(center.x, 0, center.y);
        // mesh.setPivotPoint(pivotPoint);
        // mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);
        // mesh.translate(new Vector3(center.x, 0, center.y), 1);
        const width = rect.getWidth();
        const depth = rect.getHeight();

        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);
        mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);

        return [<Mesh> mesh, skeleton];
    }
}
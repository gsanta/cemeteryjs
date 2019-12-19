import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, Axis, Space } from 'babylonjs';
import { ModelLoader } from '../services/ModelLoader';
import { GameObject } from '../types/GameObject';
import { RectangleFactory } from './RectangleFactory';
import { MaterialFactory } from './MaterialFactory';

export class ModelFactory {
    private scene: Scene;
    private modelLoader: ModelLoader;
    private counter = 0;

    constructor(scene: Scene, modelLoader: ModelLoader) {
        this.modelLoader = modelLoader;
        this.scene = scene;
    }

    public createMesh(gameObject: GameObject): Mesh {
        if (!gameObject.modelFileName) {
            return new RectangleFactory(this.scene, new MaterialFactory(this.scene), 0.1).createItem(gameObject);
            // return this.createPlaceHolderMesh(gameObject);
        }

        const mesh = this.modelLoader.createInstance(gameObject.modelFileName);

        mesh.isVisible = true;

        const center = gameObject.dimensions.getBoundingCenter();
        const pivotPoint = new Vector3(center.x, 0, center.y);
        // mesh.setPivotPoint(pivotPoint);
        // mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);
        // mesh.translate(new Vector3(center.x, 0, center.y), 1);
        mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);

        mesh.position.x = center.x;
        mesh.position.z = center.y;

        return <any> mesh;
    }

    private createPlaceHolderMesh(gameObject: GameObject): Mesh {
        const boundingInfo = gameObject.dimensions.getBoundingInfo();
        const width = boundingInfo.max[0] - boundingInfo.min[0];
        const depth = boundingInfo.max[1] - boundingInfo.min[1];

        const plane = MeshBuilder.CreatePlane("plane", {width, height: depth}, this.scene);
        
        const center = gameObject.dimensions.getBoundingCenter();
        plane.translate(new Vector3(3, 0, 3), 1);

        const material = new StandardMaterial('empty-area-material', this.scene);
        material.diffuseColor = new Color3(1, 0, 0);
        plane.material = material;

        return plane;
    }
}
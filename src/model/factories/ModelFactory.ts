import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3 } from 'babylonjs';
import { ModelLoader } from '../services/ModelLoader';
import { GameObject } from '../types/GameObject';
import { RectangleFactory } from './RectangleFactory';
import { MaterialFactory } from './MaterialFactory';

export class ModelFactory {
    private modelImportService: ModelLoader;
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        this.modelImportService = new ModelLoader(scene);
    }

    public createMesh(gameObject: GameObject): Mesh {
        if (!gameObject.modelPath) {
            return new RectangleFactory(this.scene, new MaterialFactory(this.scene), 0.1).createItem(gameObject);
            // return this.createPlaceHolderMesh(gameObject);
        }

        return this.modelImportService.getModelByPath(gameObject.modelPath).mesh;
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
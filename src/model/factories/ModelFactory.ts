import { Axis, Color3, Mesh, MeshBuilder, Scene, Skeleton, Space, StandardMaterial, Vector3 } from "babylonjs";
import { WorldItem } from "../..";
import { ModelLoader } from '../services/ModelLoader';

export class ModelFactory {
    private modelImportService: ModelLoader;

    constructor(scene: Scene) {
        this.modelImportService = new ModelLoader(scene);
    }

    public createMesh(worldItem: WorldItem): Mesh {
        return this.modelImportService.getModelByPath(worldItem.modelPath).mesh;
    }
}
import { Axis, Color3, Mesh, MeshBuilder, Scene, Skeleton, Space, StandardMaterial, Vector3 } from "babylonjs";
import { WorldItem } from "../../..";
import { ModelImportService } from '../../../model/services/ModelImportService';

export class ModelFactory {
    private modelImportService: ModelImportService;

    constructor(scene: Scene) {
        this.modelImportService = new ModelImportService(scene);
    }

    public getInstance(worldItemInfo: WorldItem): Promise<Mesh> {
        return this.modelImportService.load('').then(modelData => modelData.mesh);
    }
}
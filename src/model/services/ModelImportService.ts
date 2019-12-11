import { Point } from "@nightshifts.inc/geometry";
import { AnimationGroup, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial, Texture } from 'babylonjs';
import { Mesh } from "babylonjs/Meshes/mesh";
import { WorldItem } from "../..";

export interface ModelData {
    mesh: Mesh;
    skeleton?: Skeleton;
    dimensions: Point;
}

export class ModelImportService {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    models: Map<string, ModelData> = new Map();

    private pendingModels: Set<string> = new Set();

    loadAll(worldItems: WorldItem[]): Promise<void> {
        const promises = worldItems
            .filter(item => item.modelPath)
            .map(item => this.load(item.modelPath));

        return Promise.all(promises).then();
    }

    load(path: string): Promise<ModelData> {
        if (this.pendingModels.has(path)) { return }

        this.pendingModels.add(path);

        return new Promise(resolve => {
            const onSuccess = (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[], ag: AnimationGroup[]) => {

                this.configMesh(meshes[0]);
                const modelData = this.createModelData(meshes[0]);

                this.models.set(path, modelData);
                resolve(modelData);
            };

            const onError = (scene: Scene, message: string) => {
                throw new Error(message);
            };

            const [basePath, fileName] = this.splitPathIntoBaseAndFileName(path)
            SceneLoader.ImportMesh(
                '',
                basePath,
                fileName,
                this.scene,
                onSuccess,
                () => {},
                onError
            );
        });
    }

    getModelByPath(path: string): ModelData {
        return this.models.get(path);
    }

    private splitPathIntoBaseAndFileName(path: string): [string, string] {
        const lastSlashIndex = path.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            return [path.substring(0, lastSlashIndex + 1), path.substring(lastSlashIndex + 1)]
        } else {
            return ['/', path];
        }
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
    }

    private createModelData(mesh: Mesh): ModelData {
        const dimensions = this.getMeshDimensions(mesh);

        return {
            mesh,
            dimensions
        }
    }

    private getMeshDimensions(mesh: Mesh): Point {
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        if (mesh.getBoundingInfo().boundingBox.extendSize.x > 0) {
            const extend = mesh.getBoundingInfo().boundingBox.extendSizeWorld;
            return new Point(extend.x * 2, extend.z * 2);
        }

        return new Point(1, 1);
    }


    private loadMaterials(materialFileNames: string[]): StandardMaterial[] {
        return materialFileNames.map(file => {
            const material = new StandardMaterial(file, this.scene);
            material.diffuseTexture = new Texture(file, this.scene);

            return material;
        });
    }
}
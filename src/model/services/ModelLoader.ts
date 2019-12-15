import { Point } from "@nightshifts.inc/geometry";
import { AnimationGroup, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial, Texture, Mesh, InstancedMesh, AbstractMesh } from 'babylonjs';
import { WorldItem } from "../..";
import { FileData } from '../../gui/controllers/canvases/svg/models/GridCanvasStore';

export interface ModelData {
    mesh: Mesh;
    skeleton?: Skeleton;
    dimensions: Point;
    instanceCounter: number;
}

export class ModelLoader {
    private basePath = 'assets/models/';
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }
    bed
    models: Map<string, ModelData> = new Map();

    private pendingModels: Set<string> = new Set();

    loadAll(worldItems: WorldItem[]): Promise<void> {
        const promises = worldItems
            .filter(item => item.modelFileName)
            .map(item => this.load(item.modelFileName));

        return Promise.all(promises).then();
    }

    load(fileName: string): Promise<ModelData> {
        if (this.pendingModels.has(fileName)) { return }

        this.pendingModels.add(fileName);

        return new Promise(resolve => {
            const onSuccess = (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[], ag: AnimationGroup[]) => {


                this.configMesh(meshes[0]);
                const modelData = this.createModelData(meshes[0]);

                this.models.set(fileName, modelData);
                resolve(modelData);
            };

            const onError = (scene: Scene, message: string) => {
                throw new Error(message);
            };

            // const [basePath, fileName] = this.splitPathIntoBaseAndFileName(path)
            const folder = fileName.split('.')[0];
            SceneLoader.ImportMesh(
                '',
                `${this.basePath}${folder}/`,
                fileName,
                this.scene,
                onSuccess,
                () => {},
                onError
            );
        });
    }

    getModel(fileName: string): ModelData {
        return this.models.get(fileName);
    }

    createInstance(fileName: string): AbstractMesh {
        const model = this.models.get(fileName);

        let clone: AbstractMesh;

        if (model.instanceCounter === 0) {
            clone = model.mesh;
        } else {
            clone = <AbstractMesh> model.mesh.instantiateHierarchy();
        }
        model.instanceCounter++;
        
        return clone;
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
            dimensions,
            instanceCounter: 0
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

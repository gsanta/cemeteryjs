import { AbstractMesh, AnimationGroup, Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, Vector3 } from 'babylonjs';
import { WorldItem } from "../..";
import { Point } from '../../model/geometry/shapes/Point';

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
    models: Map<string, ModelData> = new Map();

    private pendingModels: Set<string> = new Set();

    loadAll(worldItems: WorldItem[]): Promise<void> {
        const promises = worldItems
            .filter(item => item.modelFileName)
            .map(item => this.load(item.modelFileName));

        return Promise.all(promises).then();
    }

    load(fileName: string): Promise<ModelData> {
        if (this.models.has(fileName)) { return Promise.resolve(this.models.get(fileName)); }

        // this.pendingModels.add(fileName);

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
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        model.instanceCounter++;
        
        return clone;
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

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        return new Point(width, height);
    }
}

import { AbstractMesh, Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, Vector3 } from 'babylonjs';
import { WorldItem } from "../..";
import { Point } from '../../model/geometry/shapes/Point';

export interface ModelData {
    mesh: Mesh;
    skeleton: Skeleton;
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

    private modelFileNames: Set<String> = new Set();

    loadAll(worldItems: WorldItem[]): Promise<void> {
        const modeledItems = worldItems.filter(item => item.modelFileName);

        const promises: Promise<ModelData>[] = [];

        for (let i = 0; i < modeledItems.length; i++) {
            if (!this.modelFileNames.has(modeledItems[i].modelFileName)) {
                promises.push(this.load(modeledItems[i].modelFileName));
            }
        }

        return Promise.all(promises).then();
    }

    load(fileName: string): Promise<ModelData> {
        if (this.models.has(fileName)) { return Promise.resolve(this.models.get(fileName)); }

        this.modelFileNames.add(fileName);

        return new Promise(resolve => {
            const folder = fileName.split('.')[0];

            SceneLoader.ImportMesh(
                '',
                `${this.basePath}${folder}/`,
                fileName,
                this.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(fileName, meshes, skeletons)),
                () => { },
                (scene: Scene, message: string) => { throw new Error(message); }
            );
        });
    }

    createInstance(fileName: string): [AbstractMesh, Skeleton] {
        const model = this.models.get(fileName);

        let clone: AbstractMesh;

        if (model.instanceCounter === 0) {
            clone = model.mesh;
        } else {
            clone = <AbstractMesh> model.mesh.instantiateHierarchy();
            // model.mesh.isVisible = false;
        }
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        model.instanceCounter++;
        
        return [clone, model.skeleton];
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
    }

    private getMeshDimensions(mesh: Mesh): Point {
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        return new Point(width, height);
    }

    private createModelData(fileName: string, meshes: Mesh[], skeletons: Skeleton[]): ModelData {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        // meshes = meshes.filter(mesh => mesh.name !== '__root__');

        // if (meshes.length !== 1) { throw new Error('Loading model with multiple meshes not supported yet.') }

        this.configMesh(meshes[0]);
        const dimensions = this.getMeshDimensions(meshes[0]);

        const modelData: ModelData = {
            mesh: meshes[0],
            skeleton: skeletons ? skeletons[0] : null,
            dimensions,
            instanceCounter: 0
        }

        this.models.set(fileName, modelData);

        return modelData;
    }
}

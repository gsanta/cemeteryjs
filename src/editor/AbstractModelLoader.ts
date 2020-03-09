import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, Vector3, StandardMaterial, Texture } from 'babylonjs';
import { Point } from '../misc/geometry/shapes/Point';
import { MeshObject } from '../game/models/objects/MeshObject';
import { ServiceLocator } from './services/ServiceLocator';
import { MeshConcept } from './windows/canvas/models/concepts/MeshConcept';

export interface ModelData {
    mesh: Mesh;
    skeleton: Skeleton;
    dimensions: Point;
    instanceCounter: number;
}

export abstract class AbstractModelLoader {
    private basePath = 'assets/models/';
    protected scene: Scene;

    private loadedFileNames: Set<String> = new Set();
    protected getServices: () => ServiceLocator;

    constructor(scene: Scene, getServices: () => ServiceLocator) {
        this.scene = scene;
        this.getServices = getServices;
    }

    loadAll(meshObjects: {modelPath: string}[]): Promise<Mesh[]> {
        const modeledGameObjects = meshObjects.filter(item => item.modelPath);

        const promises: Promise<Mesh>[] = [];

        for (let i = 0; i < modeledGameObjects.length; i++) {
            if (!this.loadedFileNames.has(modeledGameObjects[i].modelPath)) {
                const meshPromise = this.load(<any> modeledGameObjects[i]);
                promises.push(meshPromise);
            }
        }

        return Promise.all(promises);
    }

    load(meshObject: MeshObject | MeshConcept): Promise<Mesh> {
        this.loadedFileNames.add(meshObject.modelPath);

        return this.getServices().storageService().loadAsset(meshObject.modelPath)
                .then((data) => this.loadMesh(meshObject, data))
                .catch(() => this.loadMesh(meshObject, meshObject.modelPath));
    }

    private loadMesh(meshObject: MeshObject | MeshConcept, dataOrFileName: string): Promise<Mesh> {
        const folder = this.getFolderNameFromFileName(meshObject.modelPath);
        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                `${this.basePath}${folder}/`,
                dataOrFileName,
                this.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(meshObject, meshes, skeletons)),
                () => { },
                (scene: Scene, message: string) => { throw new Error(message); }
            );
        });
    }

    clear(): void {
        this.loadedFileNames = new Set();
    }

    abstract createInstance(fileName: string, meshName: string): string;
    protected abstract setModel(fileName: string, mesh: Mesh): void;

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
    }

    private createModelData(meshObject: MeshObject | MeshConcept, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        meshes[0].material = new StandardMaterial(meshObject.modelPath, this.scene);
        (<StandardMaterial> meshes[0].material).diffuseTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(meshObject.modelPath)}/${meshObject.texturePath}`,  this.scene);
        (<StandardMaterial> meshes[0].material).specularTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(meshObject.modelPath)}/${meshObject.texturePath}`,  this.scene);

        meshes[0].name = meshObject.name;
        this.configMesh(meshes[0]);
        this.setModel(meshObject.modelPath, meshes[0]);

        return meshes[0];
    }

    private getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}

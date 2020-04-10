import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial, Texture } from 'babylonjs';
import { Point } from '../misc/geometry/shapes/Point';
import { MeshObject } from '../game/models/objects/MeshObject';
import { ServiceLocator } from './services/ServiceLocator';
import { MeshConcept } from './views/canvas/models/concepts/MeshConcept';

export interface ModelData {
    mesh: Mesh;
    skeleton: Skeleton;
    dimensions: Point;
    instanceCounter: number;
}

export abstract class AbstractModelLoader {
    private basePath = 'assets/models/';

    private loadedFileNames: Set<String> = new Set();
    protected getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator) {
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
        if (this.loadedFileNames.has(meshObject.modelPath)) {
            return Promise.resolve(null);
        }
        
        this.loadedFileNames.add(meshObject.modelPath);

        return this.getServices().storageService().loadAsset(meshObject.modelPath)
            .then((data) => {
                if (data) {
                    return this.loadMesh(meshObject, data);
                } else {
                    return this.loadMesh(meshObject, meshObject.modelPath);
                }
            });
    }

    private loadMesh(meshObject: MeshObject | MeshConcept, dataOrFileName: string): Promise<Mesh> {
        let folder = this.getFolderNameFromFileName(meshObject.modelPath);
        let path = `${this.basePath}${folder}/`;
        let fileName = dataOrFileName;
        if (dataOrFileName.startsWith('data:')) {
            path = dataOrFileName;
            fileName = undefined;
        }
        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                path,
                fileName,
                this.getServices().gameService().gameEngine.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(meshObject, meshes, skeletons)),
                () => { },
                (scene: Scene, message: string) => { throw new Error(message); }
            );
        });
    }

    clear(): void {
        this.loadedFileNames = new Set();
    }

    protected abstract setModel(fileName: string, mesh: Mesh): void;

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
    }

    private createModelData(meshObject: MeshObject | MeshConcept, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const scene = this.getServices().gameService().gameEngine.scene;

        meshes[0].material = new StandardMaterial(meshObject.modelPath, scene);
        (<StandardMaterial> meshes[0].material).diffuseTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(meshObject.modelPath)}/${meshObject.texturePath}`,  scene);
        (<StandardMaterial> meshes[0].material).specularTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(meshObject.modelPath)}/${meshObject.texturePath}`,  scene);

        meshes[0].name = meshObject.id;
        this.configMesh(meshes[0]);
        this.setModel(meshObject.modelPath, meshes[0]);

        return meshes[0];
    }

    private getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}

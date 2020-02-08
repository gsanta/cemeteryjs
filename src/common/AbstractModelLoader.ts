import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, Vector3, StandardMaterial, Texture } from 'babylonjs';
import { Point } from '../model/geometry/shapes/Point';
import { GameObject } from '../world_generator/services/GameObject';
import { MeshObject } from '../game/models/objects/MeshObject';

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

    constructor(scene: Scene) {
        this.scene = scene;
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

    load(meshObject: MeshObject | GameObject): Promise<Mesh> {
        this.loadedFileNames.add(meshObject.modelPath);

        return new Promise(resolve => {
            const folder = this.getFolderNameFromFileName(meshObject.modelPath);

            SceneLoader.ImportMesh(
                '',
                `${this.basePath}${folder}/`,
                meshObject.modelPath,
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

    abstract createInstance(fileName: string): string;
    protected abstract setModel(fileName: string, mesh: Mesh): void;

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
    }

    private createModelData(meshObject: MeshObject | GameObject, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        meshes[0].material = new StandardMaterial(meshObject.modelPath, this.scene);
        (<StandardMaterial> meshes[0].material).diffuseTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(meshObject.modelPath)}/${meshObject.texturePath}`,  this.scene);
        (<StandardMaterial> meshes[0].material).specularTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(meshObject.modelPath)}/${meshObject.texturePath}`,  this.scene);

        meshes[0].name = meshObject.modelPath;
        this.configMesh(meshes[0]);
        // meshes[0].scaling = new Vector3(5, 5, 5);
        this.setModel(meshObject.modelPath, meshes[0]);
        // this.scene.beginAnimation(skeletons[0], 0, 24, true);

        return meshes[0];
    }

    private getMaterialFileNameFromModelFileName(fileName: string) {
        return `${fileName.substr(0, fileName.lastIndexOf('.'))}.png`;
    }

    private getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}

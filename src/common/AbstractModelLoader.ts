import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, Vector3, StandardMaterial, Texture } from 'babylonjs';
import { WorldItem } from "..";
import { Point } from '../model/geometry/shapes/Point';

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

    loadAll(worldItems: WorldItem[]): Promise<Mesh[]> {
        const modeledItems = worldItems.filter(item => item.modelFileName);

        const promises: Promise<Mesh>[] = [];

        for (let i = 0; i < modeledItems.length; i++) {
            if (!this.loadedFileNames.has(modeledItems[i].modelFileName)) {
                const meshPromise = this.load(modeledItems[i].modelFileName);
                promises.push(meshPromise);
            }
        }

        return Promise.all(promises);
    }

    load(fileName: string): Promise<Mesh> {
        this.loadedFileNames.add(fileName);

        return new Promise(resolve => {
            const folder = this.getFolderNameFromFileName(fileName);

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

    private createModelData(fileName: string, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const materialFileName = this.getMaterialFileNameFromModelFileName(fileName);
        meshes[0].material = new StandardMaterial(fileName, this.scene);
        (<StandardMaterial> meshes[0].material).diffuseTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(fileName)}/${materialFileName}`,  this.scene);
        (<StandardMaterial> meshes[0].material).specularTexture  = new Texture(`${this.basePath}${this.getFolderNameFromFileName(fileName)}/${materialFileName}`,  this.scene);

        meshes[0].name = fileName;
        this.configMesh(meshes[0]);
        // meshes[0].scaling = new Vector3(5, 5, 5);
        this.setModel(fileName, meshes[0]);
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

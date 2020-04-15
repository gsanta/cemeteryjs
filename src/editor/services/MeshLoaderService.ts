import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial } from 'babylonjs';
import { Point } from '../../misc/geometry/shapes/Point';
import { Stores } from '../stores/Stores';
import { ServiceLocator } from './ServiceLocator';
import { MeshObject } from '../../game/models/objects/MeshObject';

export class MeshLoaderService {
    serviceName = 'mesh-loader-service'
    private basePath = 'assets/models/';

    private loadedFileNames: Set<String> = new Set();
    private pendingFileNames: Map<string, Promise<any>> = new Map();

    protected getServices: () => ServiceLocator;
    private getStores: () => Stores;

    private fileNameToMeshNameMap: Map<string, string> = new Map();

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
    }

    getDimensions(path: string, id: string): Promise<Point> {
        return this
            .load(path, id)
            .then(mesh => {
                mesh.computeWorldMatrix();
                mesh.getBoundingInfo().update(mesh._worldMatrix);
        
                const boundingVectors = mesh.getHierarchyBoundingVectors();
                const width = boundingVectors.max.x - boundingVectors.min.x;
                const height = boundingVectors.max.z - boundingVectors.min.z;
                let dimensions = new Point(width, height).mul(10);
        
                dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
                dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
                return dimensions;
            });
    }

    protected setModel(fileName: string, mesh: Mesh): void {
        this.getStores().meshStore.addTemplate(fileName, mesh);
        this.fileNameToMeshNameMap.set(fileName, mesh.name);
    }

    loadAll(meshObjects: MeshObject[]): Promise<Mesh[]> {
        const modeledMeshObjets = meshObjects.filter(item => item.modelPath);

        const promises: Promise<Mesh>[] = [];

        for (let i = 0; i < modeledMeshObjets.length; i++) {
            promises.push(this.load(modeledMeshObjets[i].modelPath, modeledMeshObjets[i].id));
        }

        return Promise.all(promises);
    }

    load(path: string, id: string): Promise<Mesh> {
        if (this.pendingFileNames.has(path)) {
            return this.pendingFileNames.get(path);
        }

        this.loadedFileNames.add(path);

        const promise = this.getServices().storageService().loadAsset(path)
            .then((data) => {
                if (data) {
                    return this.loadMesh(path, id, data);
                } else {
                    return this.loadMesh(path, id);
                }
            })
            .catch(e => this.loadMesh(path, id));

        this.pendingFileNames.set(path, promise);
        return <Promise<Mesh>> promise;
    }

    private loadMesh(file: string, id: string, data?: string): Promise<Mesh> {
        let folder = MeshLoaderService.getFolderNameFromFileName(file);
        let path = `${this.basePath}${folder}/`;

        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                data ? data : folder,
                data ? undefined : file,
                this.getServices().gameService().gameEngine.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(file, id, meshes, skeletons)),
                () => { },
                (scene: Scene, message: string) => { throw new Error(message); }
            );
        });
    }

    clear(): void {
        this.loadedFileNames = new Set();
        this.pendingFileNames = new Map();
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
    }

    private createModelData(path: string, id: string, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const scene = this.getServices().gameService().gameEngine.scene;

        meshes[0].material = new StandardMaterial(path, scene);
   
        meshes[0].name = id;
        this.configMesh(meshes[0]);
        this.setModel(path, meshes[0]);

        return meshes[0];
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
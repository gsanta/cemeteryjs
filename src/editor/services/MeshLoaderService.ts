import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial } from 'babylonjs';
import { Point } from '../../misc/geometry/shapes/Point';
import { Stores } from '../stores/Stores';
import { MeshConcept } from '../views/canvas/models/concepts/MeshConcept';
import { ServiceLocator } from './ServiceLocator';
import { UpdateTask } from './UpdateServices';

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

    getDimensions(modelPath: string): Promise<Point> {
        return this
            .load(modelPath)
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
        this.getStores().meshStore.addModel(mesh.name, fileName, mesh);
        this.fileNameToMeshNameMap.set(fileName, mesh.name);
    }

    private setMeshDimensions(meshConcept: MeshConcept): Point {
        const mesh = this.getStores().meshStore.getMesh(meshConcept.id);

        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        let dimensions = new Point(width, height).mul(10);

        dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
        dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
        return dimensions;
    }

    private getDimension(mesh: Mesh): Point {
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        return new Point(width, height);
    }

    private getAnimations(meshView: MeshConcept, mesh: Mesh) {
        return mesh.skeleton ? mesh.skeleton.getAnimationRanges().map(range => range.name) : [];
    }

    loadAll(meshObjects: {modelPath: string}[]): Promise<Mesh[]> {
        const modeledGameObjects = meshObjects.filter(item => item.modelPath);

        const promises: Promise<Mesh>[] = [];

        for (let i = 0; i < modeledGameObjects.length; i++) {
            promises.push(this.load(<any> modeledGameObjects[i]));
        }

        return Promise.all(promises);
    }

    load(path: string): Promise<Mesh> {
        if (this.pendingFileNames.has(path)) {
            return this.pendingFileNames.get(path);
        }

        this.loadedFileNames.add(path);

        const promise = this.getServices().storageService().loadAsset(path)
            .then((data) => {
                if (data) {
                    return this.loadMesh(data);
                } else {
                    return this.loadMesh(path);
                }
            })
            .catch(e => console.log(e))

        this.pendingFileNames.set(path, promise);
        return <Promise<Mesh>> promise;
    }

    private loadMesh(dataOrFileName: string): Promise<Mesh> {
        let folder: string;
        let path = `${this.basePath}${folder}/`;
        let fileName = dataOrFileName;
        if (dataOrFileName.startsWith('data:')) {
            path = dataOrFileName;
            fileName = undefined;
        } else {
            folder = MeshLoaderService.getFolderNameFromFileName(dataOrFileName);
        }

        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                path,
                fileName,
                this.getServices().gameService().gameEngine.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(dataOrFileName, meshes, skeletons)),
                () => { },
                (scene: Scene, message: string) => { throw new Error(message); }
            );
        });
    }

    clear(): void {
        this.loadedFileNames = new Set();
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = false;
    }

    private createModelData(path: string, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const scene = this.getServices().gameService().gameEngine.scene;

        meshes[0].material = new StandardMaterial(path, scene);
   
        meshes[0].name = path;
        this.configMesh(meshes[0]);
        this.setModel(path, meshes[0]);

        return meshes[0];
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
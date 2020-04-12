import { Mesh, Vector3, Space, SceneLoader, ParticleSystem, Skeleton, Scene, StandardMaterial, Texture } from 'babylonjs';
import { Stores } from '../stores/Stores';
import { ServiceLocator } from './ServiceLocator';
import { MeshConcept } from '../views/canvas/models/concepts/MeshConcept';
import { UpdateTask } from './UpdateServices';
import { Point } from '../../misc/geometry/shapes/Point';
import { MeshObject } from '../../game/models/objects/MeshObject';
import { Rectangle } from '../../misc/geometry/shapes/Rectangle';

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

    setDimensions(meshConcept: MeshConcept) {
        this.load(meshConcept).then(mesh => {
            this.setMeshDimensions(meshConcept);
        });
    }

    protected setModel(fileName: string, mesh: Mesh): void {
        this.getStores().meshStore.addModel(mesh.name, fileName, mesh);
        this.fileNameToMeshNameMap.set(fileName, mesh.name);
    }

    private setMeshDimensions(meshConcept: MeshConcept) {
        const mesh = this.getStores().meshStore.getMesh(meshConcept.id);
        const dimensions = this.getDimension(mesh).mul(10);
        dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
        dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
        meshConcept.dimensions = meshConcept.dimensions.setWidth(dimensions.x).setHeight(dimensions.y);
        meshConcept.animations = this.getAnimations(meshConcept, mesh);

        this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
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

    load(meshObject: MeshObject | MeshConcept): Promise<Mesh> {
        if (this.pendingFileNames.has(meshObject.modelPath)) {
            return this.pendingFileNames.get(meshObject.modelPath);
        }

        this.loadedFileNames.add(meshObject.modelPath);

        const promise = this.getServices().storageService().loadAsset(meshObject.modelPath)
            .then((data) => {
                if (data) {
                    return this.loadMesh(meshObject, data);
                } else {
                    return this.loadMesh(meshObject, meshObject.modelPath);
                }
            })
            .catch(e => console.log(e))

        this.pendingFileNames.set(meshObject.modelPath, promise);
        return <Promise<Mesh>> promise;
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
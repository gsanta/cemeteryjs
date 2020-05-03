import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial } from 'babylonjs';
import { Point } from '../../misc/geometry/shapes/Point';
import { Registry } from '../Registry';
import { ModelConcept } from '../views/canvas/models/concepts/ModelConcept';
import { MeshConcept } from '../views/canvas/models/concepts/MeshConcept';

export class MeshLoaderService {
    serviceName = 'mesh-loader-service'
    private basePath = 'assets/models/';

    private loadedFileNames: Set<String> = new Set();
    private pendingFileNames: Map<string, Promise<any>> = new Map();

    private fileNameToMeshNameMap: Map<string, string> = new Map();
    
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    getDimensions(modelConcept: ModelConcept, id: string): Promise<Point> {
        return this
            .load(modelConcept, id)
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

    getAnimations(modelConcept: ModelConcept, id: string): Promise<string[]> {
        return this
            .load(modelConcept, id)
            .then(mesh => {
                return mesh.skeleton ? mesh.skeleton.getAnimationRanges().map(range => range.name) : [];
            });
    }

    protected setModel(fileName: string, mesh: Mesh): void {
        this.registry.stores.meshStore.addTemplate(fileName, mesh);
        this.fileNameToMeshNameMap.set(fileName, mesh.name);
    }

    loadAll(meshObjects: MeshConcept[]): Promise<Mesh[]> {
        const modeledMeshObjets = meshObjects.filter(item => item.modelId);

        const promises: Promise<Mesh>[] = [];

        for (let i = 0; i < modeledMeshObjets.length; i++) {
            const modelConcept = this.registry.stores.canvasStore.getModelConceptById(modeledMeshObjets[i].modelId);
            promises.push(this.load(modelConcept, modeledMeshObjets[i].id));
        }

        return Promise.all(promises);
    }

    load(modelConcept: ModelConcept, id: string): Promise<Mesh> {
        if (this.pendingFileNames.has(modelConcept.modelPath)) {
            return this.pendingFileNames.get(modelConcept.modelPath);
        }

        this.loadedFileNames.add(modelConcept.modelPath);

        const promise = this.registry.services.storage.loadAsset(modelConcept.modelPath)
            .then((data) => {
                if (data) {
                    return this.loadMesh(modelConcept.modelPath, id, data);
                } else {
                    return this.loadMesh(modelConcept.modelPath, id);
                }
            })
            .catch(e => this.loadMesh(modelConcept.modelPath, id));

        this.pendingFileNames.set(modelConcept.modelPath, promise);
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
                this.registry.services.game.gameEngine.scene,
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

        const scene = this.registry.services.game.gameEngine.scene;

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
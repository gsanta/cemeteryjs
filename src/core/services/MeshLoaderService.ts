import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial } from 'babylonjs';
import { AbstractPluginService } from '../../plugins/common/AbstractPluginService';
import { AbstractPlugin } from '../AbstractPlugin';
import { Point } from '../geometry/shapes/Point';
import { MeshView } from '../models/views/MeshView';
import { AssetModel } from '../stores/AssetStore';
import { EngineService } from './EngineService';

export class MeshLoaderService extends AbstractPluginService<AbstractPlugin> {
    serviceName = 'mesh-loader-service'
    private basePath = 'assets/models/';

    private loadedFileNames: Set<String> = new Set();
    private pendingFileNames: Map<string, Promise<any>> = new Map();
    private fileNameToMeshNameMap: Map<string, string> = new Map();

    getDimensions(assetModel: AssetModel, id: string): Promise<Point> {
        return this
            .load(assetModel, id)
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

    getAnimations(assetModel: AssetModel, id: string): Promise<string[]> {
        return this
            .load(assetModel, id)
            .then(mesh => {
                return mesh.skeleton ? mesh.skeleton.getAnimationRanges().map(range => range.name) : [];
            });
    }

    protected setModel(fileName: string, mesh: Mesh): void {
        this.registry.stores.meshStore.addTemplate(fileName, mesh);
        this.fileNameToMeshNameMap.set(fileName, mesh.name);
    }

    loadAll(meshObjects: MeshView[]): Promise<Mesh[]> {
        const modeledMeshObjets = meshObjects.filter(item => item.modelId);

        const promises: Promise<Mesh>[] = [];

        for (let i = 0; i < modeledMeshObjets.length; i++) {
            const assetModel = this.registry.stores.assetStore.getAssetById(modeledMeshObjets[i].modelId);
            promises.push(this.load(assetModel, modeledMeshObjets[i].id));
        }

        return Promise.all(promises);
    }

    load(assetModel: AssetModel, id: string): Promise<Mesh> {
        if (this.pendingFileNames.has(assetModel.path)) {
            return this.pendingFileNames.get(assetModel.path);
        }

        this.loadedFileNames.add(assetModel.path);

        const promise = this.registry.services.localStore.loadAsset(assetModel)
        .then(() => {
                if (assetModel.data) {
                    return this.loadMesh(assetModel.path, id, assetModel.data);
                } else {
                    return this.loadMesh(assetModel.path, id);
                }
            })
            .catch(e => this.loadMesh(assetModel.path, id));

        this.pendingFileNames.set(assetModel.path, promise);
        return <Promise<Mesh>> promise;
    }

    private loadMesh(file: string, id: string, data?: string): Promise<Mesh> {
        let folder = MeshLoaderService.getFolderNameFromFileName(file);
        let path = `${this.basePath}${folder}/`;
        const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);

        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                data ? data : folder,
                data ? undefined : file,
                engineService.getScene(),
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
        mesh.isVisible = true;
    }

    private createModelData(path: string, id: string, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);

        meshes[0].material = new StandardMaterial(path, engineService.getScene());
   
        meshes[0].name = id;
        this.configMesh(meshes[0]);
        this.setModel(path, meshes[0]);

        return meshes[0];
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
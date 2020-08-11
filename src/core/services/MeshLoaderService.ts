import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial } from 'babylonjs';
import { AbstractPluginService } from '../../plugins/common/AbstractPluginService';
import { AbstractCanvasPlugin } from '../plugins/AbstractCanvasPlugin';
import { Point } from '../../utils/geometry/shapes/Point';
import { MeshView } from '../stores/views/MeshView';
import { EngineService } from './EngineService';
import { AssetModel } from '../stores/game_objects/AssetModel';

export class MeshLoaderService extends AbstractPluginService<AbstractCanvasPlugin> {
    static serviceName = 'mesh-loader-service';
    serviceName = MeshLoaderService.serviceName;

    private loadedIds: Set<String> = new Set();
    private pandingIds: Map<string, Promise<any>> = new Map();

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

    loadAll(meshObjects: MeshView[]): Promise<Mesh[]> {
        return new Promise((resolve, reject) => {
            const modeledMeshObjets = meshObjects.filter(item => item.modelId);
    
            const promises: Promise<Mesh>[] = [];
    
            for (let i = 0; i < modeledMeshObjets.length; i++) {
                const assetModel = this.registry.stores.assetStore.getAssetById(modeledMeshObjets[i].modelId);
                promises.push(this.load(assetModel, modeledMeshObjets[i].id));
            }
    
            Promise.all(promises)
                .then((meshes) => resolve(meshes))
                .catch(() => reject());
        });
    }

    load(assetModel: AssetModel, id: string): Promise<Mesh> {
        // if (this.pandingIds.has(assetModel.id)) {
        //     return this.pandingIds.get(assetModel.id);
        // }

        this.loadedIds.add(assetModel.id);

        const promise = this.registry.services.localStore.loadAsset(assetModel)
            .then(() => this.loadMesh(assetModel))
            .catch(e => this.loadMesh(assetModel));

        this.pandingIds.set(assetModel.id, promise);
        return <Promise<Mesh>> promise;
    }

    private loadMesh(assetModel: AssetModel): Promise<Mesh> {
        const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);

        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                assetModel.data,
                undefined,
                engineService.getScene(),
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(assetModel, meshes, skeletons)),
                () => { },
                (scene: Scene, message: string) => { throw new Error(message); }
            );
        });
    }

    clear(): void {
        this.loadedIds = new Set();
        this.pandingIds = new Map();
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = true;
    }

    private createModelData(assetModel: AssetModel, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);

        meshes[0].material = new StandardMaterial(assetModel.id, engineService.getScene());
   
        meshes[0].name = assetModel.id;
        this.configMesh(meshes[0]);

        this.registry.stores.meshStore.addTemplate(assetModel.id, meshes[0]);

        return meshes[0];
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
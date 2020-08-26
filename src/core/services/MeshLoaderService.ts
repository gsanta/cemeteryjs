import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial } from 'babylonjs';
import { AbstractPluginService } from '../plugins/AbstractPluginService';
import { AbstractCanvasPlugin } from '../plugins/AbstractCanvasPlugin';
import { Point } from '../../utils/geometry/shapes/Point';
import { MeshView } from '../models/views/MeshView';
import { EngineService } from './EngineService';
import { AssetObj } from '../models/game_objects/AssetObj';

export class MeshLoaderService extends AbstractPluginService<AbstractCanvasPlugin> {
    static serviceName = 'mesh-loader-service';
    serviceName = MeshLoaderService.serviceName;

    private loadedIds: Set<String> = new Set();
    private pandingIds: Map<string, Promise<any>> = new Map();

    getDimensions(asset: AssetObj, id: string): Promise<Point> {
        return this
            .load(asset, id)
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

    getAnimations(asset: AssetObj, id: string): Promise<string[]> {
        return this
            .load(asset, id)
            .then(mesh => {
                return mesh.skeleton ? mesh.skeleton.getAnimationRanges().map(range => range.name) : [];
            });
    }

    loadAll(meshObjects: MeshView[]): Promise<Mesh[]> {
        return new Promise((resolve, reject) => {
            const modeledMeshObjets = meshObjects.filter(item => item.modelId);
    
            const promises: Promise<Mesh>[] = [];
    
            for (let i = 0; i < modeledMeshObjets.length; i++) {
                const asset = this.registry.stores.assetStore.getAssetById(modeledMeshObjets[i].modelId);
                promises.push(this.load(asset, modeledMeshObjets[i].id));
            }
    
            Promise.all(promises)
                .then((meshes) => resolve(meshes))
                .catch(() => reject());
        });
    }

    load(asset: AssetObj, id: string): Promise<Mesh> {
        this.loadedIds.add(asset.id);

        const promise = this.registry.services.localStore.loadAsset(asset)
            .then(() => this.loadMesh(asset))
            .catch(e => this.loadMesh(asset));

        this.pandingIds.set(asset.id, promise);
        return <Promise<Mesh>> promise;
    }

    private loadMesh(asset: AssetObj): Promise<Mesh> {
        const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);

        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                asset.data,
                undefined,
                engineService.getScene(),
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(asset, meshes, skeletons)),
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

    private createModelData(asset: AssetObj, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);

        meshes[0].material = new StandardMaterial(asset.id, engineService.getScene());
   
        meshes[0].name = asset.id;
        this.configMesh(meshes[0]);

        this.registry.stores.meshStore.addTemplate(asset.id, meshes[0]);

        return meshes[0];
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
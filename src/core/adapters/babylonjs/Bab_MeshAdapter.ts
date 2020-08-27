import { IMeshAdapter } from "../IMeshAdapter";
import { MeshObj } from "../../models/game_objects/MeshObj";
import { Registry } from "../../Registry";
import { Mesh } from "babylonjs/Meshes/mesh";
import { AssetObj } from "../../models/game_objects/AssetObj";
import { EngineService } from "../../services/EngineService";
import { SceneLoader, ParticleSystem, Skeleton } from "babylonjs";
import { Scene } from "babylonjs/scene";


export  class Bab_MeshAdapter implements IMeshAdapter {
    
    private loadedIds: Set<String> = new Set();
    private pandingIds: Map<string, Promise<any>> = new Map();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    load(meshObj: MeshObj) {

        const assetObj = this.registry.stores.assetStore.getAssetById(meshObj.modelId);

        this.loadedIds.add(assetObj.id);

        const promise = this.registry.services.localStore.loadAsset(assetObj)
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
}
import { AnimationGroup, Mesh, SceneLoader, Skeleton, StandardMaterial, Texture } from "babylonjs";
import { AssetObj } from "../../../../models/objs/AssetObj";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export interface LoadedMeshData {
    loadedMeshes: Mesh[];
    loadedAnimationGroups: AnimationGroup[];
    loadedSkeletons: Skeleton[];
}

export class MeshLoader {
    private engineFacade: Bab_EngineFacade;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    async load(assetObj: AssetObj): Promise<LoadedMeshData> {
        try {
            const result = await SceneLoader.ImportMeshAsync(null, assetObj.path, undefined, this.engineFacade.scene);
            return this.createMeshData(assetObj, result.meshes as Mesh[], result.skeletons, result.animationGroups);
        } catch(e) {
            console.error(e);
        }
    }

    private createMeshData(asset: AssetObj, meshes: Mesh[], skeletons: Skeleton[], animationGroups: AnimationGroup[]): LoadedMeshData {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const mainMesh = meshes.find(mesh => !mesh.parent) || meshes[0];

        // meshes[1].material = new StandardMaterial(asset.id, this.engineFacade.scene);
        // (<StandardMaterial> meshes[1].material).diffuseTexture = new Texture('assets/example_game/people/pal.png',  this.engineFacade.scene);
        (meshes[1] as Mesh).material = new StandardMaterial(asset.id, this.engineFacade.scene);
        (<StandardMaterial> (meshes[1] as Mesh).material).diffuseTexture  = new Texture('assets/example_game/people/pal.png',  this.engineFacade.scene);

        meshes[1].isPickable = true;
        meshes[1].checkCollisions = true;
        meshes[1].receiveShadows = true;
        // meshes.forEach(mesh => mesh.isVisible = false);

        return {
            loadedMeshes: meshes,
            loadedAnimationGroups: animationGroups,
            loadedSkeletons: skeletons
        }
    }
}
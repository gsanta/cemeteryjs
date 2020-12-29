import { AnimationGroup, Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { IMeshLoaderAdapter } from "../../IMeshLoaderAdapter";
import { AssetObj } from "../../../models/objs/AssetObj";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { MeshData } from "./Bab_Meshes";
import { toVector3 } from "./Bab_Utils";
import 'babylonjs-loaders';

export  class Bab_MeshLoader implements IMeshLoaderAdapter {
    
    private loadedIds: Set<String> = new Set();

    templates: Set<Mesh> = new Set();
    templatesById: Map<string, MeshData> = new Map();

    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    async load(meshObj: MeshObj): Promise<void> {
        const assetObj = this.registry.stores.assetStore.getAssetById(meshObj.modelId);

        this.loadedIds.add(assetObj.id);

        try {
            await this.loadMesh(assetObj)
            this.setupInstance(meshObj);
        } catch(e) {
            throw new Error('Mesh loading failed');
        }
    }

    clear() {
        this.templates.forEach(template => template.dispose());
        this.templates.clear();
        this.templatesById = new Map();
    }

    private setupInstance(meshObj: MeshObj) {
        const position = meshObj.getPosition();
        const model = this.registry.stores.assetStore.getAssetById(meshObj.modelId);
        const meshData = this.templatesById.get(model.id);
        const templateMesh = meshData.mainMesh;
        const rotation = meshObj.getRotation();
        const visibility = meshObj.getVisibility();

        let clone: Mesh;

        if (!this.engineFacade.meshes.meshes.has(meshObj)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            // clone.name = meshObj.id;
        }
        this.engineFacade.meshes.meshes.set(meshObj, {mainMesh: clone, skeletons: meshData.skeletons, animationGroups: meshData.animationGroups, meshes: []});

        
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        clone.isVisible = true;

        const scale = meshObj.getScale();
        clone.scaling = new Vector3(scale.x, scale.x, scale.x);
        clone.position.y = position.y;
        clone.rotationQuaternion = undefined;
        clone.visibility = visibility;

        clone.setAbsolutePosition(new Vector3(position.x, 0, position.z));
        clone.rotation = toVector3(rotation);
        
        this.engineFacade.meshes.createMaterial(meshObj);
    }

    private async loadMesh(asset: AssetObj): Promise<void> {
        try {
            const result = await SceneLoader.ImportMeshAsync(null, asset.path, undefined, this.engineFacade.scene);
            // const result = await SceneLoader.ImportMeshAsync(null, 'assets/example_game/people/', 'main_character.glb', this.engineFacade.scene);
            this.createModelData(asset, result.meshes as Mesh[], result.skeletons, result.animationGroups);
            result.animationGroups[1].start(true);
        } catch (e) {
            console.error(e);
        }
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = true;
    }

    private createModelData(asset: AssetObj, meshes: Mesh[], skeletons: Skeleton[], animationGroups: AnimationGroup[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const mainMesh = meshes.find(mesh => !mesh.parent) || meshes[0];

        meshes[1].material = new StandardMaterial(asset.id, this.engineFacade.scene);
        (<StandardMaterial> meshes[1].material).diffuseTexture = new Texture('assets/example_game/people/pal.png',  this.engineFacade.scene);
        // (meshes[0].getChildren()[0].getChildren()[0] as Mesh).material = new StandardMaterial(asset.id, this.engineFacade.scene);
        // (<StandardMaterial> (meshes[0].getChildren()[0].getChildren()[0] as Mesh).material).diffuseTexture  = new Texture('assets/example_game/people/pal.png',  this.engineFacade.scene);


        // meshes = meshes.filter(mesh => meshes.includes(mesh.parent));

        // meshes[0].name = asset.id;
        this.configMesh(meshes[0]);

        const meshData = {mainMesh, skeletons, animationGroups, meshes};

        this.templates.add(mainMesh);
        this.templatesById.set(asset.id, meshData);

        return meshes[0];
    }

    private removeDuplicateMeshes(meshes: Mesh[], uniqueMeshes: Mesh[]) {
        
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
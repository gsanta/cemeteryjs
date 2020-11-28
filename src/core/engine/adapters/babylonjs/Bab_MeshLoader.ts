import { Mesh, ParticleSystem, Scene, SceneLoader, Skeleton, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { IMeshLoaderAdapter } from "../../IMeshLoaderAdapter";
import { AssetObj } from "../../../models/objs/AssetObj";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { MeshData } from "./Bab_Meshes";
// require('babylonjs-loaders');

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

        let clone: Mesh;

        if (!this.engineFacade.meshes.meshes.has(meshObj.id)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshObj.id;
        }
        this.engineFacade.meshes.meshes.set(meshObj.id, {mainMesh: clone, skeletons: meshData.skeletons});

        
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        clone.isVisible = true;

        const scale = meshObj.getScale();
        clone.scaling = new Vector3(scale.x, scale.x, scale.x);
        clone.position.y = meshObj.yPos;
        clone.rotationQuaternion = undefined;

        clone.setAbsolutePosition(new Vector3(position.x, 0, position.z));

        clone.rotation.y = meshObj.getRotation();
        
        this.engineFacade.meshes.createMaterial(meshObj);
    }

    private loadMesh(asset: AssetObj): Promise<Mesh> {
        return new Promise((resolve, reject) => {
            SceneLoader.ImportMesh(
                '',
                asset.path,
                undefined,
                this.engineFacade.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[], animGroups) => resolve(this.createModelData(asset, meshes, skeletons)),
                () => {},
                (scene: Scene, message: string) => { reject(message); }
            );
        });
    }

    private configMesh(mesh: Mesh) {        
        mesh.isPickable = true;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        mesh.isVisible = true;
    }

    private createModelData(asset: AssetObj, meshes: Mesh[], skeletons: Skeleton[]): Mesh {
        if (meshes.length === 0) { throw new Error('No mesh was loaded.') }

        const mainMesh = meshes.find(mesh => !mesh.parent) || meshes[0];

        meshes[0].material = new StandardMaterial(asset.id, this.engineFacade.scene);
   
        meshes[0].name = asset.id;
        this.configMesh(meshes[0]);

        const meshData = {mainMesh, skeletons};

        this.templates.add(mainMesh);
        this.templatesById.set(asset.id, meshData);

        return meshes[0];
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
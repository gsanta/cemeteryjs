import { ParticleSystem, SceneLoader, Skeleton, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { Scene } from "babylonjs/scene";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { AssetObj } from "../../models/game_objects/AssetObj";
import { MeshObj } from "../../models/game_objects/MeshObj";
import { Registry } from "../../Registry";
import { IMeshLoaderAdapter } from "../IMeshLoaderAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

export  class Bab_MeshLoader implements IMeshLoaderAdapter {
    
    private loadedIds: Set<String> = new Set();

    templates: Set<Mesh> = new Set();
    templatesById: Map<string, Mesh> = new Map();

    private registry: Registry;
    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    async load(meshObj: MeshObj): Promise<void> {
        const assetObj = this.registry.stores.assetStore.getAssetById(meshObj.modelId);

        this.loadedIds.add(assetObj.id);

        await this.registry.services.localStore.loadAsset(assetObj);
        await this.loadMesh(assetObj)

        this.setupInstance(meshObj);
    }

    clear() {
        this.templates.forEach(template => template.dispose());
        this.templates.clear();
        this.templatesById = new Map();
    }

    private setupInstance(meshObj: MeshObj) {
        const model = this.registry.stores.assetStore.getAssetById(meshObj.meshView.obj.modelId);
        const templateMesh = this.templatesById.get(model.id);

        let clone: Mesh;

        if (!this.engineFacade.meshes.meshes.has(meshObj.id)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshObj.meshView.id;
        }
        this.engineFacade.meshes.meshes.set(meshObj.id, clone);
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        
        meshObj.meshView.meshName = clone.name;


        clone.isVisible = true;
        const scale = meshObj.meshView.getScale();
        clone.scaling = new Vector3(scale, scale, scale);
        clone.position.y = meshObj.meshView.yPos;
        clone.rotationQuaternion = undefined;

        const rect = <Rectangle> meshObj.meshView.dimensions.div(10);
        const width = rect.getWidth();
        const depth = rect.getHeight();

        clone.setAbsolutePosition(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2));

        clone.rotation.y = meshObj.meshView.getRotation();

        meshObj.meshView.obj.mesh = clone;
        this.createMaterial(meshObj);
    }

    createMaterial(meshModel: MeshObj) {
        const textureObj = this.registry.stores.assetStore.getAssetById(meshModel.meshView.obj.textureId);

        if (!meshModel.meshView.obj.mesh || !textureObj) {
            return;
        }
        
        (<StandardMaterial> meshModel.meshView.obj.mesh.material).diffuseTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
        (<StandardMaterial> meshModel.meshView.obj.mesh.material).specularTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
    }

    private loadMesh(asset: AssetObj): Promise<Mesh> {
        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                asset.path,
                undefined,
                this.engineFacade.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[], animGroups) => resolve(this.createModelData(asset, meshes, skeletons)),
                () => { },
                (scene: Scene, message: string) => { throw new Error(message); }
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

        meshes[0].material = new StandardMaterial(asset.id, this.engineFacade.scene);
   
        meshes[0].name = asset.id;
        this.configMesh(meshes[0]);

        this.templates.add(meshes[0]);
        this.templatesById.set(asset.id, meshes[0]);

        return meshes[0];
    }

    static getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}
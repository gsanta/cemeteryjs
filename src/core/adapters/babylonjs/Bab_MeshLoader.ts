import { ParticleSystem, SceneLoader, Skeleton, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { Scene } from "babylonjs/scene";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { AssetObj } from "../../models/objs/AssetObj";
import { MeshObj } from "../../models/objs/MeshObj";
import { Registry } from "../../Registry";
import { IMeshLoaderAdapter } from "../IMeshLoaderAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { MeshData } from "./Bab_Meshes";

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
        const meshData = this.templatesById.get(model.id);
        const templateMesh = meshData.mainMesh;

        let clone: Mesh;

        if (!this.engineFacade.meshes.meshes.has(meshObj.id)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshObj.meshView.id;
        }
        this.engineFacade.meshes.meshes.set(meshObj.id, {mainMesh: clone, skeletons: meshData.skeletons});
        
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
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
        
        this.engineFacade.meshes.createMaterial(meshObj);
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

        const mainMesh = meshes.find(mesh => mesh.parent) || meshes[0];

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
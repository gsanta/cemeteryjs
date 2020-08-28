import { IMeshAdapter } from "../IMeshLoader";
import { MeshObj } from "../../models/game_objects/MeshObj";
import { Registry } from "../../Registry";
import { Mesh } from "babylonjs/Meshes/mesh";
import { AssetObj } from "../../models/game_objects/AssetObj";
import { SceneLoader, ParticleSystem, Skeleton, StandardMaterial, Vector3, Texture } from "babylonjs";
import { Scene } from "babylonjs/scene";
import { BabylonEngineFacade } from "./BabylonEngineFacade";
import { RectangleFactory } from "../../stores/RectangleFactory";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Point } from "../../../utils/geometry/shapes/Point";

export  class Bab_MeshLoader implements IMeshAdapter {
    
    private loadedIds: Set<String> = new Set();
    private pandingIds: Map<string, Promise<any>> = new Map();

    private templates: Set<Mesh> = new Set();
    private templatesById: Map<string, Mesh> = new Map();

    meshes: Map<string, Mesh> = new Map();


    private rectangleFactory: RectangleFactory = new RectangleFactory(0.1);

    private registry: Registry;
    private engineFacade: BabylonEngineFacade;

    constructor(registry: Registry, engineFacade: BabylonEngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    load(meshObj: MeshObj) {
        const assetObj = this.registry.stores.assetStore.getAssetById(meshObj.modelId);

        this.loadedIds.add(assetObj.id);

        const promise = this.registry.services.localStore.loadAsset(assetObj)
            .then(() => this.loadMesh(assetObj))
            .catch(e => this.loadMesh(assetObj));

        this.pandingIds.set(assetObj.id, promise);
        return <Promise<Mesh>> promise;
    }

    getDimensions(meshObj: MeshObj): Promise<Point> {
        return this
            .load(meshObj)
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

    createInstance(meshObj: MeshObj): Promise<void> {
        return new Promise(resolve => {
            if (!meshObj.meshView.obj.modelId) {
                const mesh = this.rectangleFactory.createMesh(meshObj.meshView, this.engineFacade.scene);
                this.meshes.set(meshObj.id, mesh);
                meshObj.meshView.obj.mesh = mesh;
                return;
            }
    
            const modelModel = this.registry.stores.assetStore.getAssetById(meshObj.meshView.obj.modelId);
    
            this.load(meshObj)
                .then(() => this.setupInstance(meshObj))
                .then(() => resolve());
        });
    }

    createMaterial(meshModel: MeshObj) {
        const textureObj = this.registry.stores.assetStore.getAssetById(meshModel.meshView.obj.textureId);

        if (!meshModel.meshView.obj.mesh) {
            return;
        }

        this.registry.services.localStore.loadAsset(textureObj)
            .then(() => {
                (<StandardMaterial> meshModel.meshView.obj.mesh.material).diffuseTexture  = new Texture(textureObj.data,  this.engineFacade.scene);
                (<StandardMaterial> meshModel.meshView.obj.mesh.material).specularTexture  = new Texture(textureObj.data,  this.engineFacade.scene);
            });
    }

    deleteInstance(meshObj: MeshObj) {
        const mesh = this.meshes.get(meshObj.id);
        if (this.templates.has(mesh)) {
            mesh.isVisible = false;
        } else {
            mesh.dispose();
        }

        this.meshes.delete(meshObj.id);
    }

    clear() {
        this.templates.forEach(template => template.dispose());
        this.templates.clear();
        this.templatesById = new Map();
        this.meshes = new Map();
    }

    private setupInstance(meshObj: MeshObj) {
        const model = this.registry.stores.assetStore.getAssetById(meshObj.meshView.obj.modelId);

        const templateMesh = this.templatesById.get(model.id);

        let clone: Mesh;

        if (!this.meshes.has(meshObj.id)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshObj.meshView.id;
        }
        this.meshes.set(meshObj.id, clone);
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
    }

    private loadMesh(asset: AssetObj): Promise<Mesh> {
        return new Promise(resolve => {
            SceneLoader.ImportMesh(
                '',
                asset.data,
                undefined,
                this.engineFacade.scene,
                (meshes: Mesh[], ps: ParticleSystem[], skeletons: Skeleton[]) => resolve(this.createModelData(asset, meshes, skeletons)),
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
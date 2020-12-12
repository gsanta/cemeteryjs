import { Mesh } from "babylonjs/Meshes/mesh";
import { Axis, Space, Vector3, StandardMaterial, Texture, Skeleton, Color3 } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { IMeshAdapter } from "../../IMeshAdapter";
import { BasicShapeType, MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { RectangleFactory } from "../../../stores/RectangleFactory";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { toHexString } from "../../../ui_components/react/colorUtils";
import { toVector3 } from "./Bab_Utils";

export interface MeshData {
    mainMesh: Mesh;
    skeletons: Skeleton[];
}

export  class Bab_Meshes implements IMeshAdapter {
    
    meshes: Map<MeshObj, MeshData> = new Map();
    meshToObj: Map<Mesh, MeshObj> = new Map();

    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    private rectangleFactory: RectangleFactory = new RectangleFactory(1, 'black');

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(meshObj: MeshObj, pos: Point_3): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.mainMesh.position = new Vector3(pos.x, pos.y, pos.z);
    }

    getPosition(meshObj: MeshObj): Point_3 {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        return new Point_3(meshData.mainMesh.position.x, meshData.mainMesh.position.y, meshData.mainMesh.position.z);
    }

    setScale(meshObj: MeshObj, point: Point_3) {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.mainMesh.scaling = new Vector3(point.x, point.y, point.z);
    } 

    getScale(meshObj: MeshObj): Point_3 {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        return new Point_3(meshData.mainMesh.scaling.x, meshData.mainMesh.scaling.y, meshData.mainMesh.scaling.z);
    } 

    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space: 'local' | 'global' = 'local'): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.mainMesh.translate(axis === 'x' ? Axis.X : axis === 'y' ? Axis.Y : Axis.Z, amount, space === 'local' ? Space.LOCAL : Space.WORLD);
    }

    setRotation(meshObj: MeshObj, rot: Point_3): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.mainMesh.rotation = toVector3(rot);
    }

    getRotation(meshObj: MeshObj): Point_3 {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        return new Point_3(meshData.mainMesh.rotation.x, meshData.mainMesh.rotation.y, meshData.mainMesh.rotation.z);
    }

    getDimensions(meshObj: MeshObj): Point {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        const mesh = meshData.mainMesh;
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        let dimensions = new Point(width, height).mul(10);

        dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
        dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
        return dimensions;
    }

    setColor(meshObj: MeshObj, color: string) {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.mainMesh.material = new StandardMaterial(`${meshObj}-mat`, this.engineFacade.scene);
        (<StandardMaterial> meshData.mainMesh.material).diffuseColor  = Color3.FromHexString(toHexString(color));
        (<StandardMaterial> meshData.mainMesh.material).specularColor  = Color3.FromHexString(toHexString(color));
    }

    getColor(meshObj: MeshObj): string {
        const meshData = this.meshes.get(meshObj);
        
        if (!meshData) { return; }
        if (!meshData.mainMesh.material) { return; }

        return (<StandardMaterial> meshData.mainMesh.material).diffuseColor.toHexString();
    }

    setVisibility(meshObj: MeshObj, visibility: number): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.mainMesh.visibility = visibility;
    }

    getVisibility(meshObj: MeshObj): number {        
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return undefined; }

        return meshData.mainMesh.visibility;
    }

    async createInstance(meshObj: MeshObj): Promise<boolean> {
        const scaling = meshObj.getScale();

        if (meshObj.shapeConfig) {
            await this.createPrimitiveMeshInstance(meshObj);
        } else if(meshObj.modelId) {
            await this.createModeledMeshInstance(meshObj);
        } else {
            await this.createPlaceHolderMeshInstance(meshObj);
        }

        const meshData = this.meshes.get(meshObj);
        if (meshData && meshData.mainMesh) {
            meshData.mainMesh.scaling = toVector3(scaling);
            this.meshToObj.set(meshData.mainMesh, meshObj);
        }

        return true;
    }

    private async createPrimitiveMeshInstance(meshObj: MeshObj) {
        switch(meshObj.shapeConfig.shapeType) {
            case 'Box':
                this.registry.engine.meshFactory.box(meshObj);
                break;
            case 'Sphere':
                this.registry.engine.meshFactory.sphere(meshObj);
                break;
            case BasicShapeType.Ground:
                this.registry.engine.meshFactory.ground(meshObj);
                break;
        }
    }

    private async createModeledMeshInstance(meshObj: MeshObj) {
        let meshData = this.meshes.get(meshObj);
        this.meshes.delete(meshObj);
        try {
            await this.engineFacade.meshLoader.load(meshObj);
            if (meshData) {
                meshData.mainMesh.dispose();
                meshData.skeletons.forEach(skeleton => skeleton.dispose());
            }
            meshData = this.meshes.get(meshObj);
        } catch(e) {
            if (meshData) {
                meshData.mainMesh.dispose();
            }

            this.createPlaceHolderMeshInstance(meshObj);
        }


    }

    private createPlaceHolderMeshInstance(meshObj: MeshObj) {
        const mesh = this.rectangleFactory.createMesh(meshObj, this.engineFacade.scene);
        this.meshes.set(meshObj, {mainMesh: mesh, skeletons: []});
    }

    deleteInstance(meshObj: MeshObj) {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        const mesh = meshData.mainMesh;

        if (this.engineFacade.meshLoader.templates.has(mesh)) {
            mesh.isVisible = false;
        } else {
            mesh.dispose();
        }

        this.meshes.delete(meshObj);
    }

    createMaterial(meshObj: MeshObj) {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        let mesh = meshData.mainMesh;

        const textureObj = this.registry.stores.assetStore.getAssetById(meshObj.textureId);

        if (textureObj && textureObj.path) {
            // TODO detect mesh with material in a safer way
            mesh = <Mesh> (mesh.getChildMeshes().length > 0 ? mesh.getChildMeshes()[0] : mesh);
            
            (<StandardMaterial> mesh.material).diffuseTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
            (<StandardMaterial> mesh.material).specularTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
        }
    }

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean): boolean {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return false; }

        const skeletalMesh = meshData.mainMesh.skeleton ? meshData.mainMesh : meshData.mainMesh.getChildMeshes().find(childMesh => childMesh.skeleton);
        
        if (!skeletalMesh) { return false; }

        this.engineFacade.scene.beginAnimation(skeletalMesh.skeleton, startFrame, endFrame, repeat);
        return true;
    }
}
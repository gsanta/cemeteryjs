import { Mesh } from "babylonjs/Meshes/mesh";
import { Point } from "../../../utils/geometry/shapes/Point";
import { MeshObj } from "../../models/game_objects/MeshObj";
import { Registry } from "../../Registry";
import { RectangleFactory } from "../../stores/RectangleFactory";
import { IMeshAdapter } from "../IMeshAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Axis, Space, Quaternion, Vector3, StandardMaterial, Texture } from "babylonjs";

export  class Bab_Meshes implements IMeshAdapter {
    
    meshes: Map<string, Mesh> = new Map();

    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    private rectangleFactory: RectangleFactory = new RectangleFactory(0.1, 'black');

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(meshObj: MeshObj, pos: Point): void {
        const mesh = this.meshes.get(meshObj.id);
        if (!mesh) { return; }

        mesh.position = new Vector3(pos.x, 0, pos.y);
    }

    getPosition(meshObj: MeshObj): Point {
        const mesh = this.meshes.get(meshObj.id);

        if (mesh) {
            return new Point(mesh.position.x, mesh.position.z);
        }
    }

    setScale(meshObj: MeshObj, point: Point) {
        const mesh = this.meshes.get(meshObj.id);
        if (mesh) {
            mesh.scaling = new Vector3(point.x, mesh.scaling.y, point.y);
        }
    } 

    getScale(meshObj: MeshObj): Point {
        const mesh = this.meshes.get(meshObj.id);
        if (mesh) {
            return new Point(mesh.scaling.x, mesh.scaling.y);
        }
    } 

    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space: 'local' | 'global' = 'local'): void {
        const mesh = this.meshes.get(meshObj.id);
        mesh.translate(axis === 'x' ? Axis.X : axis === 'y' ? Axis.Y : Axis.Z, amount, space === 'local' ? Space.LOCAL : Space.WORLD);
    }

    rotate(meshObj: MeshObj, angle: number): void {
        const mesh = this.meshes.get(meshObj.id);
        if (mesh) {
            mesh.rotation.y += angle;
            // mesh.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), angle);
        }
    }

    getDimensions(meshObj: MeshObj): Point {
        const mesh = this.meshes.get(meshObj.id);
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

    async createInstance(meshObj: MeshObj): Promise<void> {
        if (!meshObj.meshView.obj.modelId) {
            const mesh = this.rectangleFactory.createMesh(meshObj, this.engineFacade.scene);
            this.meshes.set(meshObj.id, mesh);
            return;
        }

        await this.engineFacade.meshLoader.load(meshObj);
    }

    deleteInstance(meshObj: MeshObj) {
        const mesh = this.meshes.get(meshObj.id);
        if (this.engineFacade.meshLoader.templates.has(mesh)) {
            mesh.isVisible = false;
        } else {
            mesh.dispose();
        }

        this.meshes.delete(meshObj.id);
    }

    createMaterial(meshObj: MeshObj) {
        const mesh = this.meshes.get(meshObj.id);

        if (!mesh) { return; }

        const textureObj = this.registry.stores.assetStore.getAssetById(meshObj.meshView.obj.textureId);

        if (!textureObj) {
            return;
        }
        
        (<StandardMaterial> mesh.material).diffuseTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
        (<StandardMaterial> mesh.material).specularTexture  = new Texture(textureObj.path,  this.engineFacade.scene);
    }
}
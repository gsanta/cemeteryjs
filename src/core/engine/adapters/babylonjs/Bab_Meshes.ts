import { Mesh } from "babylonjs/Meshes/mesh";
import { Axis, Space, Vector3, StandardMaterial, Texture, Skeleton, Color3, AnimationGroup } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { IMeshAdapter } from "../../IMeshAdapter";
import { BasicShapeType, MeshObj, MeshTreeNode } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { RectangleFactory } from "../../../stores/RectangleFactory";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { toHexString } from "../../../ui_components/react/colorUtils";
import { toVector3 } from "./Bab_Utils";
import { MeshCreator } from "./mesh/MeshCreator";

export interface MeshData {
    meshes: Mesh[];
    skeletons: Skeleton[];
    animationGroups: AnimationGroup[];
}

export  class Bab_Meshes implements IMeshAdapter {
    meshes: Map<MeshObj, MeshData> = new Map();
    meshToObj: Map<Mesh, MeshObj> = new Map();

    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    private rectangleFactory: RectangleFactory = new RectangleFactory(1, 'black');
    private meshCreator: MeshCreator;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
        this.meshCreator = new MeshCreator(registry, engineFacade);
    }

    setPosition(meshObj: MeshObj, pos: Point_3): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.meshes[0].position = new Vector3(pos.x, pos.y, pos.z);
    }

    getPosition(meshObj: MeshObj): Point_3 {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        return new Point_3(meshData.meshes[0].position.x, meshData.meshes[0].position.y, meshData.meshes[0].position.z);
    }

    setScale(meshObj: MeshObj, point: Point_3) {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.meshes[0].scaling = new Vector3(point.x, point.y, point.z);
    } 

    getScale(meshObj: MeshObj): Point_3 {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        return new Point_3(meshData.meshes[0].scaling.x, meshData.meshes[0].scaling.y, meshData.meshes[0].scaling.z);
    } 

    translate(meshObj: MeshObj, delta: Point_3, isGlobal: boolean): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.meshes[0].moveWithCollisions(toVector3(delta))

        // meshData.meshes[0].translate(Axis.X, delta.x, isGlobal ? Space.WORLD : Space.LOCAL);
        // meshData.meshes[0].translate(Axis.Y, delta.y, isGlobal ? Space.WORLD : Space.LOCAL);
        // meshData.meshes[0].translate(Axis.Z, delta.z, isGlobal ? Space.WORLD : Space.LOCAL);
    }

    setRotation(meshObj: MeshObj, rot: Point_3): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.meshes[0].rotation = toVector3(rot);
    }

    getRotation(meshObj: MeshObj): Point_3 {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        return new Point_3(meshData.meshes[0].rotation.x, meshData.meshes[0].rotation.y, meshData.meshes[0].rotation.z);
    }

    getDimensions(meshObj: MeshObj): Point {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        const mesh = meshData.meshes[0];
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

        meshData.meshes[0].material = new StandardMaterial(`${meshObj}-mat`, this.engineFacade.scene);
        (<StandardMaterial> meshData.meshes[0].material).diffuseColor  = Color3.FromHexString(toHexString(color));
        (<StandardMaterial> meshData.meshes[0].material).specularColor  = Color3.FromHexString(toHexString(color));
    }

    getColor(meshObj: MeshObj): string {
        const meshData = this.meshes.get(meshObj);
        
        if (!meshData) { return; }
        if (!meshData.meshes[0].material) { return; }
        const material = <StandardMaterial> meshData.meshes[0].material;

        if (material && material.diffuseColor) {
            return material.diffuseColor.toHexString();
        }
    }

    setVisibility(meshObj: MeshObj, visibility: number): void {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        meshData.meshes[0].visibility = visibility;
    }

    getVisibility(meshObj: MeshObj): number {        
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return undefined; }

        return meshData.meshes[0].visibility;
    }

    intersectsMesh(meshObj: MeshObj, otherMeshObj: MeshObj): boolean {
        const meshData1 = this.meshes.get(meshObj);
        if (!meshData1) { return undefined; }

        const meshData2 = this.meshes.get(otherMeshObj);
        if (!meshData2) { return undefined; }

        if (meshData1 && meshData2) {
            return meshData1.meshes[0].intersectsMesh(meshData2.meshes[0]);
        }

        return false;
    }

    async createInstance(meshObj: MeshObj): Promise<boolean> {
        const scaling = meshObj.getScale();

        if (meshObj.shapeConfig) {
            await this.createPrimitiveMeshInstance(meshObj);
        } else if(meshObj.modelObj) {
            await this.createModeledMeshInstance(meshObj);
        } else {
            await this.createPlaceHolderMeshInstance(meshObj);
        }

        if (meshObj.textureObj) {
            this.createMaterial(meshObj);
        }

        const meshData = this.meshes.get(meshObj);
        if (meshData && meshData.meshes[0]) {
            meshData.meshes[0].scaling = toVector3(scaling);
            this.meshToObj.set(meshData.meshes[0], meshObj);
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
        try {
            await this.engineFacade.meshLoader.load(meshObj.modelObj);
            const meshData = this.meshCreator.setupInstance(meshObj);
            this.meshes.set(meshObj, meshData);
        } catch(e) {
            this.createPlaceHolderMeshInstance(meshObj);
        }
    }

    private createPlaceHolderMeshInstance(meshObj: MeshObj) {
        const mesh = this.rectangleFactory.createMesh(meshObj, this.engineFacade.scene);
        this.meshes.set(meshObj, {skeletons: [], animationGroups: [], meshes: [mesh]});
    }

    deleteInstance(meshObj: MeshObj) {
        const { meshLoader } = this.engineFacade; 
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return; }

        const mesh = meshData.meshes[0];
        if (meshObj.modelObj) {
            const templateData = meshLoader.templatesById.get(meshObj.modelObj.id);
            templateData.instances -= 1;
            if (templateData.instances === 0) {
                meshLoader.hideTemplate(meshObj.modelObj);
            } else {
                mesh.dispose();
            }
        } else {
            mesh.dispose();
        }

        // if (this.engineFacade.meshLoader.templates.has(mesh)) {
        //     mesh.isVisible = false;
        // } else {
        //     mesh.dispose();
        // }

        this.meshes.delete(meshObj);
    }

    createMaterial(meshObj: MeshObj) {
        this.meshCreator.createMaterial(meshObj);
    }

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean): boolean {
        const meshData = this.meshes.get(meshObj);
        if (!meshData) { return false; }

        const skeletalMesh = meshData.meshes[0].skeleton ? meshData.meshes[0] : meshData.meshes[0].getChildMeshes().find(childMesh => childMesh.skeleton);
        
        if (!skeletalMesh) { return false; }

        this.engineFacade.scene.beginAnimation(skeletalMesh.skeleton, startFrame, endFrame, repeat);
        return true;
    }
}
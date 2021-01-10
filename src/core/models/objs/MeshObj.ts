import { Point_3 } from '../../../utils/geometry/shapes/Point_3';
import { IMeshAdapter } from '../../engine/IMeshAdapter';
import { Registry } from '../../Registry';
import { AssetObj } from './AssetObj';
import { IGameObj } from './IGameObj';
import { IObj, ObjFactoryAdapter, ObjJson } from './IObj';
import { PhysicsImpostorObj } from './PhysicsImpostorObj';

export const MeshObjType = 'mesh-obj';

export interface MeshObjJson extends ObjJson {
    scale: {
        x: number;
        y: number;
        z: number;
    },
    rotation: {
        x: number;
        y: number;
        z: number;
    },
    posX: number;
    posY: number;
    posZ: number;
    modelId: string;
    textureId: string;
    physicsImpostorId: string;
    routeId: string;
    color: string;
    shapeConfig: MeshShapeConfig;
    visibility: number;
}

export class MeshObjFactory extends ObjFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super(MeshObjType);
        this.registry = registry;
    }

    newInstance() {
        const obj = new MeshObj();
        obj.meshAdapter = this.registry.engine.meshes;
        return obj;
    }
}

export enum BasicShapeType {
    Cube = 'Cube',
    Sphere = 'Sphere',
    Ground = 'Ground'
}

export interface MeshShapeConfig {
    shapeType: string;
}

export interface MeshBoxConfig extends MeshShapeConfig {
    width?: number;
    height?: number;
    depth?: number;
}

export interface MeshSphereConfig extends MeshShapeConfig {
    diameter: number;
}

export interface GroundConfig extends MeshShapeConfig {
    width: number;
    height: number;
}

export interface MeshTreeNode {
    name: string;
    isPrimaryMesh: boolean;
    children: MeshTreeNode[];
}

export class MeshObj implements IGameObj {
    readonly objType = MeshObjType;
    id: string;
    name: string;
    shapeConfig: MeshShapeConfig;
    color: string;
    modelObj: AssetObj;
    textureObj: AssetObj;
    physicsImpostorObj: PhysicsImpostorObj;
    routeId: string;

    meshAdapter: IMeshAdapter;

    translate(point: Point_3, isGlobal = true) {
        this.meshAdapter.translate(this, point, false);
        // this.meshAdapter.setPosition(this, this.meshAdapter.getPosition(this).add(point));
    }

    setPosition(pos: Point_3) {
        this.meshAdapter.setPosition(this, pos);
    }

    getPosition(): Point_3 {
        return this.meshAdapter.getPosition(this);
    }

    setColor(color: string) {
        this.meshAdapter.setColor(this, color);
    }

    getColor(): string {
        return this.meshAdapter.getColor(this);
    }

    setRotation(rot: Point_3): void {
        this.meshAdapter.setRotation(this, rot)
    }

    getRotation(): Point_3 {
        return this.meshAdapter.getRotation(this);
    }

    setScale(scale: Point_3) {
        this.meshAdapter.setScale(this, scale);
    }

    getScale(): Point_3 {
        return this.meshAdapter.getScale(this);
    }

    dispose() {
        this.meshAdapter.deleteInstance(this);
    }

    setParent(parentObj: IObj & IGameObj) {
    }

    getParent(): IObj & IGameObj {
        return undefined;
    }

    /**
     * Set the visibility of a mesh
     * @param visibility number between 0 and 1, 0 means invisible, 1 means fully visible
     */
    setVisibility(visibility: number): void {
        return this.meshAdapter.setVisibility(this, visibility);
    }

    /**
     * Get the visibility of a mesh
     * @returns number between 0 and 1, 0 means invisible, 1 means fully visible
     */    
    getVisibility() {
        return this.meshAdapter.getVisibility(this);
    }

    intersectsMeshObj(otherMeshObj: MeshObj) {
        return this.meshAdapter.intersectsMesh(this, otherMeshObj);
    }

    clone(registry: Registry): MeshObj {
        const clone = new MeshObj();
        clone.meshAdapter = this.meshAdapter;
        clone.deserialize(this.serialize(), registry);
        clone.id = undefined;
        clone.textureObj = undefined;
        clone.modelObj = undefined;

        return clone;
    }

    serialize(): MeshObjJson {
        const scale = this.getScale();
        return {
            id: this.id,
            name: this.name,
            objType: this.objType,
            scale: {
                x: scale.x,
                y: scale.y,
                z: scale.z
            },
            posX: this.getPosition().x,
            posY: this.getPosition().y,
            posZ: this.getPosition().z,
            rotation: this.getRotation(),
            modelId: this.modelObj ? this.modelObj.id : undefined,
            textureId: this.textureObj ? this.textureObj.id : undefined,
            physicsImpostorId: this.physicsImpostorObj ? this.physicsImpostorObj.id : undefined,
            routeId: this.routeId,
            color: this.color,
            shapeConfig: this.shapeConfig,
            visibility: this.getVisibility()
        }
    }
    
    deserialize(json: MeshObjJson, registry: Registry) {
        this.id = json.id;
        this.name = json.name;
        this.setScale(new Point_3(json.scale.x, json.scale.y, json.scale.z));
        this.setPosition(new Point_3(json.posX, json.posY, json.posZ));
        this.setRotation(new Point_3(json.rotation.x, json.rotation.y, json.rotation.z));

        this.modelObj = json.modelId ? registry.stores.assetStore.getAssetById(json.modelId) : undefined;
        this.textureObj = json.textureId ? registry.stores.assetStore.getAssetById(json.textureId) : undefined;
        this.physicsImpostorObj = json.physicsImpostorId ? <PhysicsImpostorObj> registry.stores.objStore.getByNameOrId(json.textureId) : undefined;
        this.routeId = json.routeId;
        this.color = json.color;
        this.shapeConfig = json.shapeConfig;
        this.setVisibility(json.visibility);
    }
}
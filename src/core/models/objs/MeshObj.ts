import { Point } from '../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../utils/geometry/shapes/Point_3';
import { IMeshAdapter } from '../../engine/IMeshAdapter';
import { Registry } from '../../Registry';
import { colors } from '../../ui_components/react/styles';
import { Canvas3dPanel } from '../modules/Canvas3dPanel';
import { ObjEventType } from '../ObjObservable';
import { AssetObj } from './AssetObj';
import { AbstractGameObj } from './AbstractGameObj';
import { IObj, ObjJson } from './IObj';
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
    isCheckIntersection: boolean;
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

export class MeshObj extends AbstractGameObj {
    readonly objType = MeshObjType;
    id: string;
    name: string;
    shapeConfig: MeshShapeConfig;
    color: string = colors.darkorchid;
    modelObj: AssetObj;
    textureObj: AssetObj;
    physicsImpostorObj: PhysicsImpostorObj;
    routeId: string;
    isCheckIntersection: boolean = false;

    meshAdapter: IMeshAdapter;
    canvas: Canvas3dPanel;

    private constructor(canvas: Canvas3dPanel) {
        super(canvas);
        this.canvas = canvas;
        this.meshAdapter = canvas.engine.meshes;

        this.canvas.data.items.add(this);
    }

    static CreateMesh(canvas: Canvas3dPanel) {
        const meshObj = new MeshObj(canvas);
        meshObj.meshAdapter.createInstance(meshObj);
        return meshObj;
    }

    static CreateGround(config: MeshBoxConfig, canvas: Canvas3dPanel): MeshObj {
        const meshObj = new MeshObj(canvas);
        meshObj.shapeConfig = config;
        meshObj.meshAdapter.createInstance(meshObj);
        return meshObj;
    }

    static CreateSphere(config: MeshSphereConfig, canvas: Canvas3dPanel): MeshObj {
        const meshObj = new MeshObj(canvas);
        meshObj.shapeConfig = config;
        meshObj.meshAdapter.createInstance(meshObj);
        return meshObj;
    }

    static CreateBox(config: MeshBoxConfig, canvas: Canvas3dPanel): MeshObj {
        const meshObj = new MeshObj(canvas);
        meshObj.shapeConfig = config;
        meshObj.meshAdapter.createInstance(meshObj);
        return meshObj;
    }

    translate(point: Point_3, isGlobal = true) {
        this.meshAdapter.translate(this, point, false);
        // this.meshAdapter.setPosition(this, this.meshAdapter.getPosition(this).add(point));
        this.observable.emit({ obj: this, eventType: ObjEventType.PositionChanged });
    }

    setPosition(pos: Point_3) {
        this.meshAdapter.setPosition(this, pos);
        this.observable.emit({ obj: this, eventType: ObjEventType.PositionChanged });
    }

    getPosition(): Point_3 {
        return this.meshAdapter.getPosition(this);
    }

    getDimension(): Point {
        return this.meshAdapter.getDimensions(this);
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

    setParent(parentObj: AbstractGameObj) {
    }

    getParent(): IObj & AbstractGameObj {
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

    setBoundingBoxVisibility(isVisible: boolean) {
        this.meshAdapter.showBoundingBoxes(this, isVisible);
    }

    clone(registry: Registry): MeshObj {
        const clone = new MeshObj(this.canvas);
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
            visibility: this.getVisibility(),
            isCheckIntersection: this.isCheckIntersection
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
        // this.physicsImpostorObj = json.physicsImpostorId ? <PhysicsImpostorObj> this.canvas.data.items.getItemById(json.textureId) : undefined;
        this.routeId = json.routeId;
        this.color = json.color;
        this.shapeConfig = json.shapeConfig;
        this.setVisibility(json.visibility);
        this.isCheckIntersection = json.isCheckIntersection;
        return undefined;
    }
}
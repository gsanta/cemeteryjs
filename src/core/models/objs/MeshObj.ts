import { Point } from '../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../utils/geometry/shapes/Point_3';
import { IMeshAdapter } from '../../engine/IMeshAdapter';
import { Registry } from '../../Registry';
import { IGameObj } from './IGameObj';
import { IObj, ObjFactoryAdapter, ObjJson } from './IObj';

export const MeshObjType = 'mesh-obj';

export interface MeshObjJson extends ObjJson {
    scaleX: number;
    scaleY: number;
    posX: number;
    posY: number;
    posZ: number;
    rotation: number;
    modelId: string;
    textureId: string;
    routeId: string;
    y: number;
    color: string;
    shapeConfig: MeshShapeConfig;
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

export interface MeshShapeConfig {
    shapeType: string;
}

export interface MeshBoxConfig extends MeshShapeConfig {
    width?: number;
    height?: number;
    depth?: number;
}

export interface MeshSphereConfig extends MeshShapeConfig {
    diameter?: number;
}


export class MeshObj implements IObj, IGameObj {
    readonly objType = MeshObjType;

    id: string;

    shapeConfig: MeshShapeConfig;
    color: string;
    modelId: string;
    textureId: string;
    routeId: string;
    // TODO: when switching the app to 3D coordinates it should be removed
    yPos: number = 0;

    meshAdapter: IMeshAdapter;

    move(point: Point_3) {
        this.meshAdapter.setPosition(this, this.meshAdapter.getPosition(this).add(point));
    }

    setPosition(pos: Point_3) {
        this.meshAdapter.setPosition(this, pos);
    }

    getPosition(): Point_3 {
        return this.meshAdapter.getPosition(this);
    }

    rotate(angle: number) {
        this.meshAdapter.rotate(this, angle)
    }

    setRotation(angle: number): void {
        this.meshAdapter.setRotation(this, angle)
    }

    getRotation(): number {
        return this.meshAdapter.getRotation(this);
    }

    setScale(scale: Point) {
        this.meshAdapter.setScale(this, scale);
    }

    getScale(): Point {
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

    serialize(): MeshObjJson {
        return {
            id: this.id,
            objType: this.objType,
            scaleX: this.getScale().x,
            scaleY: this.getScale().y,
            posX: this.getPosition().x,
            posY: this.getPosition().y,
            posZ: this.getPosition().z,
            y: this.yPos,
            rotation: this.getRotation(),
            modelId: this.modelId,
            textureId: this.textureId,
            routeId: this.routeId,
            color: this.color,
            shapeConfig: this.shapeConfig
        }
    }
    
    deserialize(json: MeshObjJson) {
        this.id = json.id;
        this.setScale(new Point(json.scaleX, json.scaleY));
        this.setPosition(new Point_3(json.posX, json.posY, json.posZ));
        this.rotate(json.rotation);
        this.yPos = json.y;
        this.modelId = json.modelId;
        this.textureId = json.textureId;
        this.routeId = json.routeId;
        this.color = json.color;
        this.shapeConfig = json.shapeConfig;
    }
}
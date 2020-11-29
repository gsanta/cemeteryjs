import { Point } from '../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../utils/geometry/shapes/Point_3';
import { IMeshAdapter } from '../../engine/IMeshAdapter';
import { Registry } from '../../Registry';
import { IGameObj } from './IGameObj';
import { IObj, ObjFactoryAdapter, ObjJson } from './IObj';

export const MeshObjType = 'mesh-obj';

export interface MeshObjJson extends ObjJson {
    scale: {
        x: number;
        y: number;
        z: number;
    }
    posX: number;
    posY: number;
    posZ: number;
    rotation: number;
    modelId: string;
    textureId: string;
    routeId: string;
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

export class MeshObj implements IGameObj {
    readonly objType = MeshObjType;

    id: string;

    shapeConfig: MeshShapeConfig;
    color: string;
    modelId: string;
    textureId: string;
    routeId: string;

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

    setColor(color: string) {
        this.meshAdapter.setColor(this, color);
    }

    getColor(): string {
        return this.meshAdapter.getColor(this);
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

    serialize(): MeshObjJson {
        const scale = this.getScale();
        return {
            id: this.id,
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
            modelId: this.modelId,
            textureId: this.textureId,
            routeId: this.routeId,
            color: this.color,
            shapeConfig: this.shapeConfig
        }
    }
    
    deserialize(json: MeshObjJson) {
        this.id = json.id;
        this.setScale(new Point_3(json.scale.x, json.scale.y, json.scale.z));
        this.setPosition(new Point_3(json.posX, json.posY, json.posZ));
        this.rotate(json.rotation);
        this.modelId = json.modelId;
        this.textureId = json.textureId;
        this.routeId = json.routeId;
        this.color = json.color;
        this.shapeConfig = json.shapeConfig;
    }
}
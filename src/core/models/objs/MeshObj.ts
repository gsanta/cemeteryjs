import { Point } from '../../../utils/geometry/shapes/Point';
import { IMeshAdapter } from '../../engine/IMeshAdapter';
import { Registry } from '../../Registry';
import { IObj, ObjFactory, ObjJson } from './IObj';

export const MeshObjType = 'mesh-obj';

export interface MeshObjJson extends ObjJson {
    scaleX: number;
    scaleY: number;
    posX: number;
    posY: number;
    rotation: number;
    modelId: string;
    textureId: string;
    routeId: string;
    y: number;
}

export class MeshObjFactory implements ObjFactory {
    private registry: Registry;

    objType = MeshObjType;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    newInstance() {
        const obj = new MeshObj();
        obj.meshAdapter = this.registry.engine.meshes;
        return obj;
    }
}

export class MeshObj implements IObj {
    objType = MeshObjType;

    private startPos: Point;
    private scale: Point;
    private tempRotation: number = 0;
    id: string;

    modelId: string;
    textureId: string;
    routeId: string;
    // TODO: when switching the app to 3D coordinates it should be removed
    yPos: number = 0;

    meshAdapter: IMeshAdapter;

    move(point: Point) {
        this.startPos.add(point);

        if (this.meshAdapter) {
            this.meshAdapter.setPosition(this, this.meshAdapter.getPosition(this).add(point));
        }
    }

    setPosition(pos: Point) {
        this.startPos = pos;

        this.meshAdapter && this.meshAdapter.setPosition(this, pos);
    }

    getPosition(): Point {
        let pos = this.meshAdapter && this.meshAdapter.getPosition(this);

        if (!pos) {
            pos = this.startPos;
        }

        return pos;
    }

    rotate(angle: number) {
        if (this.meshAdapter) {
            this.meshAdapter.rotate(this, angle)
        } else {
            this.tempRotation += angle;
        }
    }

    getRotation(): number {
        const rotation = this.meshAdapter && this.meshAdapter.getRotation(this);
        return rotation || this.tempRotation;
    }

    setScale(scale: Point) {
        this.scale = scale;
        if (this.meshAdapter) {
            return this.meshAdapter.setScale(this, scale);
        }
    }

    getScale(): Point {
        const scale = this.meshAdapter && this.meshAdapter.getScale(this);
        return scale || this.scale;
    }

    dispose() {
        this.meshAdapter && this.meshAdapter.deleteInstance(this);
    }

    toJson(): MeshObjJson {
        return {
            id: this.id,
            scaleX: this.getScale().x,
            scaleY: this.getScale().y,
            posX: this.getPosition().x,
            posY: this.getPosition().y,
            y: this.yPos,
            rotation: this.getRotation(),
            modelId: this.modelId,
            textureId: this.textureId,
            routeId: this.routeId
        }
    }
    
    fromJson(json: MeshObjJson) {
        this.id = json.id;
        this.setScale(new Point(json.scaleX, json.scaleY));
        this.setPosition(new Point(json.posX, json.posY));
        this.rotate(json.rotation);
        this.yPos = json.y;
        this.modelId = json.modelId;
        this.textureId = json.textureId;
        this.routeId = json.routeId;
    }
}
import { Point } from '../../../utils/geometry/shapes/Point';
import { IMeshAdapter } from '../../adapters/IMeshAdapter';
import { IObj, ObjFactory, ObjJson } from './IObj';

export const MeshObjType = 'mesh-obj';

export interface MeshObjJson extends ObjJson {
    scaleX: number;
    scaleY: number;
}

export class MeshObjFactory implements ObjFactory {
    objType = MeshObjType;
    newInstance() {
        return new MeshObj();
    }
}

export class MeshObj implements IObj {
    objType = MeshObjType;

    private startPos: Point;
    private scale: Point;
    private tempRotation: number;
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
            scaleY: this.getScale().y
        }
    }
    
    fromJson(json: MeshObjJson) {
        this.scale = new Point(json.scaleX, json.scaleY);
    }
}
import { Point } from '../../../utils/geometry/shapes/Point';
import { IMeshAdapter } from '../../adapters/IMeshAdapter';
import { MeshView } from '../views/MeshView';
import { IGameObj, ObjJson } from './IGameObj';

export interface MeshObjJson extends ObjJson {
    scaleX: number;
    scaleY: number;
}

export class MeshObj implements IGameObj {
    meshView: MeshView;

    constructor(meshView: MeshView) {
        this.meshView = meshView;
    }

    private startPos: Point;
    private scale: Point;
    id: string;

    modelId: string;
    textureId: string;
    routeId: string;

    meshAdapter: IMeshAdapter;

    getId() {
        return this.meshView.id;
    }

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
        }
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
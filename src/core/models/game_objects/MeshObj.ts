import { Mesh, Vector3 } from 'babylonjs';
import { Point } from '../../../utils/geometry/shapes/Point';
import { IMeshAdapter } from '../../adapters/IMeshAdapter';
import { MeshView } from '../views/MeshView';
import { IGameObj, ObjJson } from './IGameObj';

export class MeshObj implements IGameObj {
    meshView: MeshView;

    constructor(meshView: MeshView) {
        this.meshView = meshView;
    }

    private startPos: Point;
    private scale: number = 1;
    id: string;

    modelId: string;
    textureId: string;
    routeId: string;

    meshAdapter: IMeshAdapter;

    getId() {
        return this.meshView.id;
    }

    getAnimations(): string[] {
        return this.meshView.animations;
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

    setScale(scale: number) {
        this.scale = scale;
        if (this.meshAdapter) {
            return this.meshAdapter.setScale(this, new Point(scale, scale));
        }
    }

    getScale(): Point {
        const scale = this.meshAdapter && this.meshAdapter.getScale(this);
        return scale || new Point(this.scale, this.scale);
    }

    dispose() {
        this.meshAdapter && this.meshAdapter.deleteInstance(this);
    }

    toJson(): ObjJson {
        throw new Error("Method not implemented.");
    }
    
    fromJson(json: ObjJson) {
        throw new Error("Method not implemented.");
    }

}
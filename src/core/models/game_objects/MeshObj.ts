import { Mesh, Vector3 } from 'babylonjs';
import { IMeshAdapter } from '../../adapters/IMeshAdapter';
import { MeshView } from '../views/MeshView';
import { IGameObj, ObjJson } from './IGameObj';

export class MeshObj implements IGameObj {
    meshView: MeshView;

    constructor(meshView: MeshView) {
        this.meshView = meshView;
    }

    mesh: Mesh;
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

    move(axis: 'x' | 'y' | 'z', amount: number, space?: 'local' | 'global') {
        // this.add(point);

        if (this.meshAdapter) {
            this.meshAdapter.translate(this, axis,  amount, space);
        }
    }

    rotate(angle: number) {
        if (this.meshAdapter) {
            this.meshAdapter.rotate(this, angle)
        }
    }

    setScale(scale: number) {
        if (this.meshView.obj.mesh) {
            this.meshView.obj.mesh.scaling = new Vector3(scale, scale, scale);
        }
    }

    toJson(): ObjJson {
        throw new Error("Method not implemented.");
    }
    
    fromJson(json: ObjJson) {
        throw new Error("Method not implemented.");
    }

}
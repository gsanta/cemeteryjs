import { MeshView } from '../views/MeshView';
import { Quaternion, Vector3, Mesh } from 'babylonjs';
import { IGameObj, ObjJson } from './IGameObj';
import { IMeshAdapter } from '../../adapters/IMeshAdapter';


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

    setRotation(angle: number) {
        if (this.meshView.obj.mesh) {
            this.meshView.obj.mesh.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), angle);
            // this.meshView.mesh.rotation.y = angle;
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
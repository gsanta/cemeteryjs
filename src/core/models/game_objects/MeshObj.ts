import { MeshView } from '../views/MeshView';
import { Quaternion, Vector3, Mesh } from 'babylonjs';
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

    getId() {
        return this.meshView.id;
    }

    getAnimations(): string[] {
        return this.meshView.animations;
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
import { MeshView } from '../views/MeshView';
import { Quaternion, Vector3 } from 'babylonjs';


export class MeshModel {
    meshView: MeshView;

    constructor(meshView: MeshView) {
        this.meshView = meshView;
    }

    getId() {
        return this.meshView.id;
    }

    getAnimations(): string[] {
        return this.meshView.animations;
    }

    setRotation(angle: number) {
        if (this.meshView.mesh) {
            this.meshView.mesh.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), angle);
            // this.meshView.mesh.rotation.y = angle;
        }
    }

    setScale(scale: number) {
        if (this.meshView.mesh) {
            this.meshView.mesh.scaling = new Vector3(scale, scale, scale);
        }
    }
}
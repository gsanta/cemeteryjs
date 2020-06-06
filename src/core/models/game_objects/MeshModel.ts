import { MeshView } from '../views/MeshView';
import { Point } from '../../geometry/shapes/Point';


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
}
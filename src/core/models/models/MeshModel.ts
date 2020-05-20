import { MeshView } from '../views/MeshView';


export class MeshModel {
    private meshView: MeshView;

    constructor(meshView: MeshView) {
        this.meshView = meshView;
    }

    getId() {
        return this.meshView.id;
    }

    getAnimations(): string[] {
        return this.meshView.animations;
    }

    getActions(): string[] {
        return this.meshView.actions;
    }

    
}
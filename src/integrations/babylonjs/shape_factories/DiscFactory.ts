import { WorldItemInfo } from "../../../WorldItemInfo";
import { MeshDescriptor } from "../MeshFactory";
import { MeshBuilder, Scene, Mesh } from 'babylonjs';


export class DiscFactory {
    private scene: Scene;
    private meshBuilder: typeof MeshBuilder;

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder) {
        this.meshBuilder = meshBuilder;
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItemInfo, meshDescriptor: MeshDescriptor) {
        const mesh = this.createDisc();

        mesh.checkCollisions = true;

        return mesh;
    }

    private createDisc() {
        return this.meshBuilder.CreateDisc("disc", {radius: 1, arc: 1, tessellation: 36, sideOrientation: Mesh.DOUBLESIDE}, this.scene);
    }
}
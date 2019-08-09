import { WorldItemInfo } from "../../../WorldItemInfo";
import { MeshDescriptor } from "../MeshFactory";
import { MeshBuilder, Scene, Mesh } from 'babylonjs';
import { WorldItemBoundingBoxCalculator } from "../factories/utils/WorldItemBoundingBoxCalculator";


export class DiscFactory {
    private scene: Scene;
    private meshBuilder: typeof MeshBuilder;
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder) {
        this.meshBuilder = meshBuilder;
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItemInfo, meshDescriptor: MeshDescriptor) {
        const mesh = this.createDisc();
        // let boundingBox = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);
        // boundingBox = boundingBox.negate('y');

        // worldItemInfo.dimensions = boundingBox;

        mesh.checkCollisions = true;

        return mesh;
    }

    private createDisc() {
        return this.meshBuilder.CreateDisc("disc", {radius: 1, arc: 1, tessellation: 36, sideOrientation: Mesh.DOUBLESIDE}, this.scene);
    }
}
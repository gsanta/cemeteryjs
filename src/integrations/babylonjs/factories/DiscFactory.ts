import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from 'babylonjs';
import { WorldItemDefinition } from '../../../WorldItemDefinition';
import { WorldItem } from "../../../WorldItem";
import { MaterialBuilder } from '../MaterialFactory';


export class DiscFactory {
    private scene: Scene;
    private meshBuilder: typeof MeshBuilder;
    private materialBuilder: typeof MaterialBuilder;

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder, materialBuilder: typeof MaterialBuilder) {
        this.scene = scene;
        this.meshBuilder = meshBuilder;
        this.materialBuilder = materialBuilder;
    }

    public createItem(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition) {
        const mesh = this.createDisc();

        mesh.material = this.materialBuilder.CreateMaterial('disc-material', this.scene);
        (<StandardMaterial> mesh.material).diffuseColor = Color3.FromHexString('#00FF00');

        const dimensions = worldItemInfo.dimensions.getBoundingCenter();
        mesh.translate(new Vector3(dimensions.x, meshDescriptor.translateY, dimensions.y), 1);

        mesh.checkCollisions = true;

        return mesh;
    }

    private createDisc() {
        return this.meshBuilder.CreateDisc("disc", {radius: 1, arc: 1, tessellation: 36, sideOrientation: Mesh.DOUBLESIDE}, this.scene);
    }
}
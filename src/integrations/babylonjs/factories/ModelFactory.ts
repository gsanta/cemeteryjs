import { Scene, MeshBuilder, Mesh, Skeleton, Axis, Space, PhysicsImpostor, Vector3, StandardMaterial, Color3 } from "babylonjs";
import { WorldItem } from "../../..";
import { MeshTemplate } from "../../../MeshTemplate";

export class ModelFactory {
    private scene: Scene;
    private meshBuilder: typeof MeshBuilder;

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder) {
        this.scene = scene;
        this.meshBuilder = meshBuilder;
    }

    public getInstance(worldItemInfo: WorldItem, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh[] {
        const meshes = meshTemplate.meshes.map(m => m.clone());
        const rotation = - worldItemInfo.rotation;
        meshes[0].isVisible = true;

        meshes[0].rotate(Axis.Y, rotation, Space.WORLD);
        const mesh = this.createBoundingMesh(worldItemInfo, meshes[0], this.scene);
        mesh.checkCollisions = true;
        const extend = meshes[0].getBoundingInfo().boundingBox.extendSizeWorld;
        // meshes[0].translate(new Vector3(0, - extend.y / 2, 0), 1, Space.WORLD);

        // mesh.isVisible = false;

        return [mesh, meshes[0]];
    }

    private createBoundingMesh(worldItemInfo: WorldItem, mesh: Mesh, scene: Scene): Mesh {
        const boundingPolygon = worldItemInfo.dimensions;
        const height = mesh.getBoundingInfo().boundingBox.maximumWorld.y;

        const extend = mesh.getBoundingInfo().boundingBox.extendSizeWorld;

        const box = this.meshBuilder.CreateBox(
            `bounding-box`,
            {  width: extend.x * 2, depth: extend.z * 2, height: extend.y * 2  },
            scene
        );

        mesh.parent = box;

        const center = boundingPolygon.getBoundingCenter();
        box.translate(new Vector3(center.x, 0, center.y), 1, Space.WORLD);

        const material = new StandardMaterial('box-material', scene);
        material.diffuseColor = Color3.FromHexString('#00FF00');
        material.alpha = 0.5;
        material.wireframe = false;
        box.material = material;
        box.isVisible = true;

        return box;
    }
}
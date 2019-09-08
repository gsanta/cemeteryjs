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
        const boundingMesh = this.createBoundingMesh(worldItemInfo, meshes[0], this.scene);

        meshes.forEach(m => {
            m.isVisible = true;
            m.parent = boundingMesh;
        });

        const rotation = - worldItemInfo.rotation;

        boundingMesh.rotate(Axis.Y, rotation, Space.WORLD);
        boundingMesh.checkCollisions = true;
        boundingMesh.isVisible = false;

        return [boundingMesh, meshes[0]];
    }

    private createBoundingMesh(worldItemInfo: WorldItem, mesh: Mesh, scene: Scene): Mesh {
        const boundingPolygon = worldItemInfo.dimensions;
        const height = mesh.getBoundingInfo().boundingBox.maximumWorld.y;

        const box = MeshBuilder.CreateBox(
            `bounding-box`,
            {  width: boundingPolygon.getBoundingInfo().extent[0], depth: boundingPolygon.getBoundingInfo().extent[1], height: height  },
            scene
        );

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
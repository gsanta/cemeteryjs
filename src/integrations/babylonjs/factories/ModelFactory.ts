
import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, Skeleton, Space, StandardMaterial, Vector3, Axis } from 'babylonjs';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { WorldItemBoundingBoxCalculator } from './utils/WorldItemBoundingBoxCalculator';
import { MeshCreator } from '../MeshCreator';

export class ModelFactory implements MeshCreator {
    private scene: Scene;
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItemInfo, meshInfo: [Mesh[], Skeleton[]]): Mesh {
        const meshes = meshInfo[0].map(m => m.clone());
        let boundingBox = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);
        // const rotation = - worldItemInfo.rotation;
        meshes[0].isVisible = true;
        // meshes[0].translate(new Vector3(0, 15, 0), 1);

        // meshes[0].rotate(Axis.Y, rotation, Space.WORLD);
        boundingBox = boundingBox.negate('y');
        worldItemInfo.dimensions = boundingBox;
        const mesh = this.createMesh(worldItemInfo, meshes[0], this.scene);
        mesh.checkCollisions = true;
        mesh.isVisible = false;

        const impostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 2, friction: 1, restitution: 0.3 }, this.scene);
        mesh.physicsImpostor = impostor;

        return mesh;
    }


    private createMesh(worldItemInfo: WorldItemInfo, mesh: Mesh, scene: Scene): Mesh {
        const boundingPolygon = worldItemInfo.dimensions;
        const height = mesh.getBoundingInfo().boundingBox.maximumWorld.y;

        const box = MeshBuilder.CreateBox(
            `bounding-box`,
            {  width: boundingPolygon.getBoundingInfo().extent[0], depth: boundingPolygon.getBoundingInfo().extent[1], height: height  },
            scene
        );

        const center = boundingPolygon.getBoundingCenter();
        box.translate(new Vector3(center.x, height, center.y), 1, Space.WORLD);

        const material = new StandardMaterial('box-material', scene);
        material.diffuseColor = Color3.FromHexString('#00FF00');
        material.alpha = 0.5;
        material.wireframe = false;
        box.material = material;
        box.isVisible = true;

        return box;
    }
}

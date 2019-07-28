
import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, Skeleton, Space, StandardMaterial, Vector3, Axis } from '@babylonjs/core';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { WorldItemBoundingBoxCalculator } from './utils/WorldItemBoundingBoxCalculator';
import { MeshCreator } from '../MeshCreator';

export class ModelFactory implements MeshCreator {
    public meshInfo: [Mesh[], Skeleton[]];
    private scene: Scene;
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    constructor(meshInfo: [Mesh[], Skeleton[]], scene: Scene) {
        this.meshInfo = meshInfo;
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItemInfo): Mesh {
        const meshes = this.meshInfo[0].map(m => m.clone());
        let boundingBox = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);
        const rotation = - worldItemInfo.rotation;
        meshes[0].isVisible = true;
        meshes[0].translate(new Vector3(0, 15, 0), 1);

        meshes[0].rotate(Axis.Y, rotation, Space.WORLD);
        boundingBox = boundingBox.negate('y');

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

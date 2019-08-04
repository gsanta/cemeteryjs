import { Axis, Mesh, Quaternion, Scene, Skeleton, Vector3 } from 'babylonjs';
import { Point, Polygon } from '@nightshifts.inc/geometry';
import { WorldItemBoundingBoxCalculator } from './utils/WorldItemBoundingBoxCalculator';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { MeshCreator } from '../MeshCreator';

export class PlayerFactory implements MeshCreator  {
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    public createItem(worldItemInfo: WorldItemInfo, meshInfo: [Mesh[], Skeleton[]]): Mesh {
        let boundingBox = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);
        let meshes = meshInfo[0]; //.map(mesh => mesh.clone('player'));
        meshes.forEach(mesh => mesh.isVisible = true);

        boundingBox = boundingBox.negate('y');
        boundingBox = boundingBox.translate(new Point(- boundingBox.getBoundingInfo().extent[0] / 2, boundingBox.getBoundingInfo().extent[1] / 2));


        // const impostor = new PhysicsImpostor(player.mesh, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, this.scene);
        // player.setImpostor(impostor);

        const quaternion = Quaternion.RotationAxis(Axis.Y, 0);
        meshes[0].rotationQuaternion = quaternion;
        meshes[0].checkCollisions = true;

        const center = boundingBox.getBoundingCenter();
        const height = meshes[0].getBoundingInfo().boundingBox.maximumWorld.y;
        meshes[0].position = new Vector3(center.x, height / 2 + 1, center.y);

        return meshes[0];
    }
}

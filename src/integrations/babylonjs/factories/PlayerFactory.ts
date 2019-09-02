import { Axis, Mesh, Quaternion, Scene, Skeleton, Vector3 } from 'babylonjs';
import { Point, Polygon } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../../WorldItem';
import { MeshCreator } from '../MeshCreator';
import { MeshTemplate } from '../../../MeshTemplate';

export class PlayerFactory implements MeshCreator  {
    public createItem(worldItemInfo: WorldItem, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh {
        let dimensions = worldItemInfo.dimensions;
        const meshes = meshTemplate.meshes;
        meshes.forEach(mesh => mesh.isVisible = true);

        dimensions = dimensions.translate(new Point(- dimensions.getBoundingInfo().extent[0] / 2, dimensions.getBoundingInfo().extent[1] / 2));

        const quaternion = Quaternion.RotationAxis(Axis.Y, 0);
        meshes[0].rotationQuaternion = quaternion;
        meshes[0].checkCollisions = true;

        const center = dimensions.getBoundingCenter();
        const height = meshes[0].getBoundingInfo().boundingBox.maximumWorld.y;
        meshes[0].position = new Vector3(center.x, height / 2 + 1, center.y);

        return meshes[0];
    }
}

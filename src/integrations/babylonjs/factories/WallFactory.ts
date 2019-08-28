import { GeometryUtils } from '@nightshifts.inc/geometry';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { Axis, Mesh, MeshBuilder, Scene, Space, Vector3 } from 'babylonjs';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { MaterialFactory } from '../MaterialFactory';
import { MeshDescriptor } from '../MeshFactory';

export class WallFactory  {
    private materialFactory: MaterialFactory;
    private scene: Scene;
    private index = 1;

    constructor(scene: Scene, materialFactory: MaterialFactory) {
        this.scene = scene;
        this.materialFactory = materialFactory;
    }

    createItem(worldItemInfo: WorldItemInfo, meshDescriptor: MeshDescriptor): Mesh {

        const parentMesh = MeshBuilder.CreateBox(
                `default-wall-container-${this.index}`,
                {
                    width: (<Segment> worldItemInfo.dimensions).getLength(),
                    depth: worldItemInfo.thickness,
                    height: 7.2
                },
                this.scene
            );

        worldItemInfo.dimensions = GeometryUtils.addThicknessToSegment(<Segment> worldItemInfo.dimensions, 0.25);

        const center = worldItemInfo.dimensions.getBoundingCenter();
        const pivotPoint = new Vector3(center.x, 0, center.y);
        parentMesh.setPivotPoint(pivotPoint);
        parentMesh.rotate(Axis.Y, worldItemInfo.rotation, Space.WORLD);
        parentMesh.translate(new Vector3(center.x, 3.6, center.y), 1);

        parentMesh.material = this.materialFactory.createMaterial(worldItemInfo, meshDescriptor);

        this.index++;

        parentMesh.computeWorldMatrix(true);
        return parentMesh;
    }
}

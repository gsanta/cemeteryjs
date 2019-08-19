import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Axis, Space } from 'babylonjs';
import { GeometryUtils } from '@nightshifts.inc/geometry';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { MeshCreator } from '../MeshCreator';

export class WallFactory implements MeshCreator  {
    private scene: Scene;
    private index = 1;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItemInfo): Mesh {

        const parentMesh = MeshBuilder.CreateBox(
                `default-wall-container-${this.index}`,
                {
                    width: (<Segment> worldItemInfo.dimensions).getLength(),
                    depth: 0.25,
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

        const mat = new StandardMaterial('wallMaterial', this.scene);
        mat.diffuseTexture = new Texture('./assets/textures/brick.jpeg', this.scene);
        parentMesh.material = mat;

        this.index++;



        parentMesh.computeWorldMatrix(true);
        return parentMesh;
    }
}

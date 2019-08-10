import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from 'babylonjs';
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

        const rectangle = GeometryUtils.addThicknessToSegment(<Segment> worldItemInfo.dimensions, 0.25);

        const parentMesh = MeshBuilder.CreateBox(
                `default-wall-container-${this.index}`,
                {
                    width: rectangle.getBoundingInfo().extent[0],
                    depth: rectangle.getBoundingInfo().extent[1],
                    height: 7.2
                },
                this.scene
            );

        const mat = new StandardMaterial('wallMaterial', this.scene);
        mat.diffuseTexture = new Texture('./assets/textures/brick.jpeg', this.scene);
        parentMesh.material = mat;

        parentMesh.translate(new Vector3(rectangle.getBoundingCenter().x, 0, rectangle.getBoundingCenter().y), 1);
        this.index++;


        parentMesh.translate(new Vector3(0, 3.6, 0), 1);

        parentMesh.computeWorldMatrix(true);
        return parentMesh;
    }
}

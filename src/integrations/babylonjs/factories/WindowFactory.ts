import { Color3, Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3, Axis, Space } from 'babylonjs';
import { GeometryUtils, Segment, Shape } from '@nightshifts.inc/geometry';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { MeshCreator } from '../MeshCreator';
import { MeshTemplate } from '../../api/MeshTemplate';
import { MeshDescriptor } from '../MeshFactory';

export class WindowFactory  {
    public meshInfo: [Mesh[], Skeleton[]];
    private scene: Scene;

    private meshBuilder: typeof MeshBuilder;

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder) {
        this.scene = scene;
        this.meshBuilder = meshBuilder;
    }

    public createItem(worldItemInfo: WorldItemInfo, meshDescriptor: MeshDescriptor, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh {
        const meshes = meshTemplate.meshes.map(m => m.clone());;

        const parentMesh = this.createSideItems(worldItemInfo.dimensions, meshDescriptor);

        meshes.forEach(m => {
            m.isVisible = true;
            m.parent = parentMesh;
        });

        const center = worldItemInfo.dimensions.getBoundingCenter();
        parentMesh.translate(new Vector3(center.x, 4, center.y), 1);
        parentMesh.rotate(Axis.Y, worldItemInfo.rotation, Space.WORLD);

        return parentMesh;
    }

    private createSideItems(boundingBox: Shape, meshDescriptor: MeshDescriptor): Mesh {
        const segment = <Segment> boundingBox;

        const rectangle = GeometryUtils.addThicknessToSegment(segment, 0.25);

        const center = segment.getBoundingCenter();

        const side1 = this.createSideItem(rectangle, `${name}-side-1`);

        const translate1 = rectangle.getBoundingCenter().subtract(center);

        const translateY = meshDescriptor.translateY ? meshDescriptor.translateY : 0;

        side1.translate(new Vector3(translate1.x, translateY, translate1.y), 1);
        side1.material.wireframe = true;
        side1.isVisible = false;
        return side1;
    }

    private createSideItem(dimension: Shape, name: string): Mesh {
        const mesh = this.meshBuilder.CreateBox(
            name,
            { width: dimension.getBoundingInfo().extent[0], depth: dimension.getBoundingInfo().extent[1], height: 8 },
            this.scene
        );

        mesh.material = new StandardMaterial('window-material', this.scene);
        mesh.receiveShadows = true;

        return mesh;
    }
}

import { Color3, Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3, Axis, Space, Texture } from 'babylonjs';
import { GeometryUtils, Segment, Shape } from '@nightshifts.inc/geometry';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { MeshCreator } from '../MeshCreator';
import { MeshTemplate } from '../../api/MeshTemplate';
import { MeshDescriptor } from '../MeshFactory';
import { MaterialFactory } from '../MaterialFactory';

export class WindowFactory  {
    private materialFactory: MaterialFactory;
    public meshInfo: [Mesh[], Skeleton[]];
    private scene: Scene;

    private meshBuilder: typeof MeshBuilder;

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder, materialFactory: MaterialFactory) {
        this.scene = scene;
        this.meshBuilder = meshBuilder;
        this.materialFactory = materialFactory;
    }

    public createItem(worldItemInfo: WorldItemInfo, meshDescriptor: MeshDescriptor, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh[] {

        const parentMesh = this.createBoundingMesh(worldItemInfo.dimensions, meshDescriptor);
        const top = this.createTopWall(worldItemInfo, meshDescriptor);
        const bottom = this.createBottomWall(worldItemInfo, meshDescriptor);
        top.parent = parentMesh;
        bottom.parent = parentMesh;

        const center = worldItemInfo.dimensions.getBoundingCenter();
        parentMesh.translate(new Vector3(center.x, 4, center.y), 1);
        parentMesh.rotate(Axis.Y, worldItemInfo.rotation, Space.WORLD);
        top.rotate(Axis.Y, worldItemInfo.rotation, Space.WORLD);
        bottom.rotate(Axis.Y, worldItemInfo.rotation, Space.WORLD);

        return [parentMesh, top, bottom];
    }

    private createTopWall(worldItem: WorldItemInfo, meshDescriptor: MeshDescriptor) {
        const segment = <Segment> worldItem.dimensions;

        const rectangle = GeometryUtils.addThicknessToSegment(segment, 0.125);

        const mesh = this.meshBuilder.CreateBox(
            name,
            { width: rectangle.getBoundingInfo().extent[0], depth: rectangle.getBoundingInfo().extent[1], height: 1.6 },
            this.scene
        );

        this.materialFactory.applyMaterial(mesh, worldItem, meshDescriptor);

        mesh.receiveShadows = true;

        return mesh;
    }

    private createBottomWall(worldItem: WorldItemInfo, meshDescriptor: MeshDescriptor) {
        const segment = <Segment> worldItem.dimensions;

        const rectangle = GeometryUtils.addThicknessToSegment(segment, 0.125);

        const mesh = this.meshBuilder.CreateBox(
            name,
            { width: rectangle.getBoundingInfo().extent[0], depth: rectangle.getBoundingInfo().extent[1], height: 3 },
            this.scene
        );

        this.materialFactory.applyMaterial(mesh, worldItem, meshDescriptor);

        mesh.receiveShadows = true;
        mesh.translate(new Vector3(0, -2, 0), 1, Space.WORLD);

        return mesh;
    }

    private createBoundingMesh(boundingBox: Shape, meshDescriptor: MeshDescriptor): Mesh {
        const segment = <Segment> boundingBox;

        const rectangle = GeometryUtils.addThicknessToSegment(segment, 0.25);

        const center = segment.getBoundingCenter();

        const mesh = this.meshBuilder.CreateBox(
            name,
            { width: rectangle.getBoundingInfo().extent[0], depth: rectangle.getBoundingInfo().extent[1], height: 8 },
            this.scene
        );

        mesh.material = new StandardMaterial('window-material', this.scene);
        mesh.receiveShadows = true;

        const translate1 = rectangle.getBoundingCenter().subtract(center);

        const translateY = meshDescriptor.translateY ? meshDescriptor.translateY : 0;

        mesh.translate(new Vector3(translate1.x, translateY, translate1.y), 1);
        mesh.material.wireframe = true;
        mesh.isVisible = false;
        return mesh;
    }
}

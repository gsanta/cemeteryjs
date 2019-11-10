import { Segment, Shape } from '@nightshifts.inc/geometry';
import { Axis, Mesh, MeshBuilder, Scene, Skeleton, Space, StandardMaterial, Vector3 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { MeshTemplate } from '../../../MeshTemplate';
import { MaterialFactory } from '../MaterialFactory';
import { WorldItemDefinition } from '../../../WorldItemDefinition';

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

    public createItem(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh[] {
        const meshes = meshTemplate.meshes.map(m => m.clone());
        const parentMesh = this.createBoundingMesh(worldItemInfo.dimensions, meshDescriptor);

        meshes.forEach(m => {
            m.isVisible = true;
            m.parent = parentMesh;
        });

        meshes[0].translate(new Vector3(0, 0, 0), 1);

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

    private createTopWall(worldItem: WorldItem, meshDescriptor: WorldItemDefinition) {
        const segment = <Segment> worldItem.dimensions;

        const rectangle = segment.addThickness(0.125);

        const mesh = this.meshBuilder.CreateBox(
            name,
            { width: rectangle.getBoundingInfo().extent[0], depth: rectangle.getBoundingInfo().extent[1], height: 1.6 },
            this.scene
        );

        mesh.material = this.materialFactory.createMaterial(worldItem, meshDescriptor);
        mesh.translate(new Vector3(0, 2.4, 0), 1, Space.WORLD);

        mesh.receiveShadows = true;

        return mesh;
    }

    private createBottomWall(worldItem: WorldItem, meshDescriptor: WorldItemDefinition) {
        const segment = <Segment> worldItem.dimensions;

        const rectangle = segment.addThickness(0.125);

        const mesh = this.meshBuilder.CreateBox(
            name,
            { width: rectangle.getBoundingInfo().extent[0], depth: rectangle.getBoundingInfo().extent[1], height: 2.3 },
            this.scene
        );

        mesh.material = this.materialFactory.createMaterial(worldItem, meshDescriptor);

        mesh.receiveShadows = true;
        mesh.translate(new Vector3(0, -2.85, 0), 1, Space.WORLD);

        return mesh;
    }

    private createBoundingMesh(boundingBox: Shape, meshDescriptor: WorldItemDefinition): Mesh {
        const segment = <Segment> boundingBox;

        const rectangle = segment.addThickness(0.25);

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

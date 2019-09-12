import { Scene, StandardMaterial, Mesh, Vector3, MeshBuilder, Skeleton } from 'babylonjs';
import { Segment, Shape } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../../WorldItem';
import { MeshTemplate } from '../../../MeshTemplate';

export class DoorFactory {
    private scene: Scene;
    private meshBuilder: typeof MeshBuilder;

    constructor(scene: Scene, meshBuilder: typeof MeshBuilder) {
        this.scene = scene;
        this.meshBuilder = meshBuilder;
    }

    public createItem(worldItemInfo: WorldItem, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh[] {
        const meshes = meshTemplate.meshes.map(m => m.clone());
        const boundingMesh = this.createBoundingMesh(worldItemInfo.dimensions);

        meshes.forEach(m => {
            m.isVisible = true;
            m.parent = boundingMesh;
        });

        const center = worldItemInfo.dimensions.getBoundingCenter();
        boundingMesh.translate(new Vector3(center.x, 4, center.y), 1);

        return [boundingMesh, ...meshes];
    }

    private createBoundingMesh(boundingBox: Shape): Mesh {
        const segment = <Segment> boundingBox;

        const rectangle = segment.addThickness(0.25);

        const center = segment.getBoundingCenter();

        const mesh = this.createSideItem(rectangle, `container`);

        const translate1 = rectangle.getBoundingCenter().subtract(center);

        mesh.translate(new Vector3(translate1.x, 0, translate1.y), 1);

        return mesh;
    }

    private createSideItem(dimension: Shape, name: string): Mesh {
        const mesh = this.meshBuilder.CreateBox(
            name,
            { width: dimension.getBoundingInfo().extent[0], depth: dimension.getBoundingInfo().extent[1], height: 8 },
            this.scene
        );

        mesh.material = new StandardMaterial('door-material', this.scene);
        mesh.material.wireframe = true;
        mesh.receiveShadows = true;

        return mesh;
    }
}

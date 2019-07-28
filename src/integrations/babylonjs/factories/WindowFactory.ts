import { Color3, Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3 } from '@babylonjs/core';
import { GeometryUtils, Segment, Shape } from '@nightshifts.inc/geometry';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { WorldItemBoundingBoxCalculator } from './utils/WorldItemBoundingBoxCalculator';
import { MeshCreator } from '../MeshCreator';

export class WindowFactory implements MeshCreator  {
    public meshInfo: [Mesh[], Skeleton[]];
    private scene: Scene;

    private meshBuilder: typeof MeshBuilder;
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    constructor(meshInfo: [Mesh[], Skeleton[]], scene: Scene, meshBuilder: typeof MeshBuilder) {
        this.meshInfo = meshInfo;
        this.scene = scene;
        this.meshBuilder = meshBuilder;
    }

    public createItem(worldItemInfo: WorldItemInfo): Mesh {
        const meshes = this.meshInfo[0].map(m => m.clone());
        let boundingBox = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);

        boundingBox = boundingBox.negate('y');

        const parentMesh = this.createSideItems(boundingBox);

        meshes.forEach(m => {
            m.isVisible = true;
            m.parent = parentMesh;
        });

        const center = boundingBox.getBoundingCenter();
        parentMesh.translate(new Vector3(center.x, 4, center.y), 1);

        return parentMesh;
    }

    private createSideItems(boundingBox: Shape): Mesh {
        const segment = <Segment> boundingBox;

        const rectangle = GeometryUtils.addThicknessToSegment(segment, 0.25);

        const center = segment.getBoundingCenter();

        const side1 = this.createSideItem(rectangle, `${name}-side-1`);

        const translate1 = rectangle.getBoundingCenter().subtract(center);

        side1.translate(new Vector3(translate1.x, 0, translate1.y), 1);
        side1.material.wireframe = true;
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

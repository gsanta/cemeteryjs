import { Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3 } from '@babylonjs/core';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { MeshCreator } from '../MeshCreator';
import { WorldItemBoundingBoxCalculator } from './utils/WorldItemBoundingBoxCalculator';

export class EmptyAreaFactory implements MeshCreator {
    private scene: Scene;
    public meshInfo: [Mesh[], Skeleton[]];
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItemInfo): Mesh {
        worldItemInfo.dimensions = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);

        const dimensions  = worldItemInfo.dimensions
            .negate('y');

        const mesh = MeshBuilder.CreatePolygon(
            worldItemInfo.name,
            {
                shape: dimensions.getPoints().map(point => new Vector3(point.x, 2, point.y)),
                depth: 2,
                updatable: true
            },
            this.scene
        );

        mesh.material = this.createMaterial(this.scene);

        mesh.isVisible = false;

        return mesh;
    }

    private createMaterial(scene: Scene): StandardMaterial {
        const material = new StandardMaterial('empty-area-material', scene);

        return material;
    }
}

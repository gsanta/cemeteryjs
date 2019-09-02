import { Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { MeshCreator } from '../MeshCreator';

export class EmptyAreaFactory implements MeshCreator {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItem): Mesh {

        const mesh = MeshBuilder.CreatePolygon(
            worldItemInfo.name,
            {
                shape: worldItemInfo.dimensions.getPoints().map(point => new Vector3(point.x, 2, point.y)),
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

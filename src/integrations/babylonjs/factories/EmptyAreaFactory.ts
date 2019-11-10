import { Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { MeshCreator } from '../MeshCreator';
import { WorldItemDefinition } from '../../../WorldItemDefinition';

export class EmptyAreaFactory {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createItem(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition): Mesh {

        const y = meshDescriptor.translateY ? meshDescriptor.translateY : 0;
        const mesh = MeshBuilder.CreatePolygon(
            worldItemInfo.name,
            {
                shape: worldItemInfo.dimensions.getPoints().map(point => new Vector3(point.x, y, point.y)),
                depth: 2,
                updatable: true
            },
            this.scene
        );

        mesh.material = this.createMaterial(this.scene);

        return mesh;
    }

    private createMaterial(scene: Scene): StandardMaterial {
        const material = new StandardMaterial('empty-area-material', scene);

        return material;
    }
}

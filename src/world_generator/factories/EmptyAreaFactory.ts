import { Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3 } from 'babylonjs';
import { GameObject } from '../services/GameObject';
import { GameObjectTemplate } from '../services/GameObjectTemplate';

export class EmptyAreaFactory {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createItem(worldItemInfo: GameObject, meshDescriptor: GameObjectTemplate): Mesh {

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

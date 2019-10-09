import { Shape } from '@nightshifts.inc/geometry';
import { DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';

export class RoomFactory  {
    private scene: Scene;
    private counter = 1;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItem): Mesh[] {
        const mesh = this.createRoomFloor(worldItemInfo.dimensions);
        mesh.receiveShadows = true;

        mesh.isVisible = true;

        // const roofMesh = this.createRoof(worldItemInfo, roomDescriptor);
        // const label = `room-${this.counter++}`;
        // const roomLabel = this.roomLabelFactory.createItem(worldItemInfo);
        // roomLabel.isVisible = false;

        // return [mesh, roofMesh];
        return [mesh];
    }

    private createRoomFloor(dimensions: Shape) {
        return MeshBuilder.CreatePolygon(
            'room',
            {
                shape: dimensions.getPoints().map(point => new Vector3(point.x, 2, point.y)),
                depth: 0.5,
                updatable: true
            },
            this.scene
        );
    }
}

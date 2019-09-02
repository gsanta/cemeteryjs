import { Shape } from '@nightshifts.inc/geometry';
import { DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { RoomDescriptor } from '../../../Config';

export class RoomFactory  {
    private scene: Scene;
    private counter = 1;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItem, roomDescriptor: RoomDescriptor): Mesh[] {
        const mesh = this.createRoomFloor(worldItemInfo.dimensions);
        mesh.receiveShadows = true;

        mesh.isVisible = true;

        const roofMesh = this.createRoof(worldItemInfo, roomDescriptor);
        // const label = `room-${this.counter++}`;
        // const roomLabel = this.roomLabelFactory.createItem(worldItemInfo);
        // roomLabel.isVisible = false;

        return [mesh, roofMesh];
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

    public createRoof(worldItemInfo: WorldItem, roomDescriptor: RoomDescriptor): Mesh {
        const roomTop = MeshBuilder.CreatePolygon(
            'room-label',
            {
                shape: worldItemInfo.dimensions.getPoints().map(point => new Vector3(point.x, 0, point.y)),
                depth: 2,
                updatable: true
            },
            this.scene
        );


        roomTop.translate(new Vector3(0, roomDescriptor.roofY, 0), 1);

        if (roomDescriptor.roofMaterialPath) {
            roomTop.material = this.createRoofMaterial('roof', roomDescriptor);
        }

        roomTop.receiveShadows = true

        return roomTop;
    }

    private createRoofMaterial(label: string, roomDescriptor: RoomDescriptor): StandardMaterial {
        const textureGround = new DynamicTexture('room-label-texture', {width: 512, height: 256}, this.scene, false);

        const material = new StandardMaterial('door-closed-material', this.scene);
        material.diffuseTexture = new Texture(roomDescriptor.roofMaterialPath, this.scene);
        // material.diffuseTexture = textureGround;
        // material.alpha = 0.5;

        const font = 'bold 60px Arial';
        textureGround.drawText(label, 200, 150, font, 'green', '#895139', true, true);

        return material;
    }
}

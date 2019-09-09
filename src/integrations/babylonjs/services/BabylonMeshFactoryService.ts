
import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, Skeleton, Space, StandardMaterial, Vector3, Axis, DynamicTexture, Texture } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { MeshTemplate } from '../../../MeshTemplate';
import { EmptyAreaFactory } from '../factories/EmptyAreaFactory';
import { PlayerFactory } from '../factories/PlayerFactory';
import { DoorFactory } from '../factories/DoorFactory';
import { WindowFactory } from '../factories/WindowFactory';
import { RectangleFactory } from '../factories/RectangleFactory';
import { RoomFactory } from '../factories/RoomFactory';
import { DiscFactory } from '../factories/DiscFactory';
import { MaterialFactory, MaterialBuilder } from '../MaterialFactory';
import { MeshDescriptor, ShapeDescriptor, RoomDescriptor } from '../../../Config';
import { MeshFactoryService } from '../../../services/MeshFactoryService';
import { ModelFactory } from '../factories/ModelFactory';

export interface MeshTemplateConfig {
    checkCollisions: boolean;
    receiveShadows: boolean;
    isPickable: boolean;
    scaling: Vector3;
    singleton: boolean;

    materials: {
        default: StandardMaterial;
        dark: StandardMaterial;
    };
}

export const defaultMeshConfig: MeshTemplateConfig = {
    checkCollisions: true,
    receiveShadows: true,
    isPickable: true,
    scaling: new Vector3(1, 1, 1),
    singleton: false,

    materials: null
};

export class BabylonMeshFactoryService implements MeshFactoryService<Mesh, Skeleton> {
    private scene: Scene;
    private modelMap: Map<string, MeshTemplate<Mesh, Skeleton>> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<Mesh, Skeleton>>): Mesh[] {
        return this.createFromTemplate(worldItemInfo, templateMap.get(worldItemInfo.name), meshDescriptor);
    }

    private createFromTemplate(worldItem: WorldItem, meshTemplate: MeshTemplate<Mesh, Skeleton>, meshDescriptor: MeshDescriptor): Mesh[] {

        if (meshDescriptor.details.name === 'shape-descriptor') {
            return this.createFromShapeDescriptor(worldItem, meshDescriptor);
        }

        switch(worldItem.name) {
            case 'root':
                return [];
            case 'empty':
                return [new EmptyAreaFactory(this.scene).createItem(worldItem, meshDescriptor)];
            case 'player':
                worldItem.skeleton = meshTemplate.skeletons[0];
                return [new PlayerFactory().createItem(worldItem, meshTemplate)];
            case 'door':
                return new DoorFactory(this.scene, MeshBuilder).createItem(worldItem, meshTemplate);
            case 'window':
                return new WindowFactory(this.scene, MeshBuilder,  new MaterialFactory(this.scene)).createItem(worldItem, meshDescriptor, meshTemplate);
            case 'room':
                return this.createRoomMeshes(worldItem, meshDescriptor.details);
            default:
                return new ModelFactory(this.scene, MeshBuilder).getInstance(worldItem, meshTemplate);
        }
    }

    private createRoomMeshes(worldItemInfo: WorldItem, roomDescriptor: RoomDescriptor): Mesh[] {
        return new RoomFactory(this.scene).createItem(worldItemInfo, roomDescriptor);
    }

    private createFromShapeDescriptor(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor<ShapeDescriptor>): Mesh[] {
        const shapeDescriptor = meshDescriptor.details;
        switch(shapeDescriptor.shape) {
            case 'disc':
                return [new DiscFactory(this.scene, MeshBuilder, MaterialBuilder).createItem(worldItemInfo, shapeDescriptor)]
            case 'plane':
                return [this.createPlane(worldItemInfo, meshDescriptor)];
            case 'rect':
                return [new RectangleFactory(this.scene, new MaterialFactory(this.scene)).createItem(worldItemInfo, meshDescriptor)];
            default:
                throw new Error('Unsupported shape: ' + shapeDescriptor.shape);
        }
    }

    private createPlane(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor<ShapeDescriptor>): Mesh {
        const roomTop = MeshBuilder.CreatePolygon(
            'room-label',
            {
                shape: worldItemInfo.dimensions.getPoints().map(point => new Vector3(point.x, 0, point.y)),
                depth: 2,
                updatable: true
            },
            this.scene
        );

        roomTop.translate(new Vector3(0, 7.21, 0), 1);

        if (meshDescriptor.materials) {
            roomTop.material = this.createMaterial('room1', meshDescriptor.materials[0]);
        }

        return roomTop;
    }

    private createMaterial(label: string, materialPath: string): StandardMaterial {
        const textureGround = new DynamicTexture('room-label-texture', {width: 512, height: 256}, this.scene, false);

        const material = new StandardMaterial('door-closed-material', this.scene);
        material.diffuseTexture = new Texture(materialPath, this.scene);
        // material.diffuseTexture = textureGround;
        // material.alpha = 0.5;

        const font = 'bold 60px Arial';
        textureGround.drawText(label, 200, 150, font, 'green', '#895139', true, true);

        return material;
    }
}

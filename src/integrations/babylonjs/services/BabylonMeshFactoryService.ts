
import { DynamicTexture, Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Texture, Vector3 } from 'babylonjs';
import { WorldItemDefinition } from '../../../WorldItemDefinition';
import { MeshTemplate } from '../../../MeshTemplate';
import { MeshFactoryService } from '../../../model/services/MeshFactoryService';
import { WorldItem, WorldItemShape } from '../../../WorldItem';
import { DiscFactory } from '../factories/DiscFactory';
import { DoorFactory } from '../factories/DoorFactory';
import { EmptyAreaFactory } from '../factories/EmptyAreaFactory';
import { ModelFactoryOld } from '../factories/ModelFactoryOld';
import { PlayerFactory } from '../factories/PlayerFactory';
import { RectangleFactory } from '../factories/RectangleFactory';
import { RoomFactory } from '../factories/RoomFactory';
import { WindowFactory } from '../factories/WindowFactory';
import { MaterialBuilder, MaterialFactory } from '../MaterialFactory';
import { PolygonFactory } from '../factories/PolygonFactory';

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

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(worldItem: WorldItem, meshDescriptor: WorldItemDefinition): Promise<void> {
        return this.createMesh(worldItem, meshDescriptor).then(mesh => {worldItem.meshTemplate.meshes = [mesh]});
    }

    getInstance(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh[] {
        return this.createFromTemplate(worldItemInfo, meshTemplate, meshDescriptor);
    }

    private createMesh(worldItem: WorldItem, meshDescriptor: WorldItemDefinition): Promise<Mesh> {
        switch(worldItem.shape) {
            case WorldItemShape.RECTANGLE:
                return new PolygonFactory(this.scene, new MaterialFactory(this.scene)).createItem(worldItem, meshDescriptor);
            case WorldItemShape.MODEL:
                return new PolygonFactory(this.scene, new MaterialFactory(this.scene)).createItem(worldItem, meshDescriptor);
        }
    }

    private createFromTemplate(worldItem: WorldItem, meshTemplate: MeshTemplate<Mesh, Skeleton>, meshDescriptor: WorldItemDefinition): Mesh[] {
        if (!meshDescriptor) {
            return [];
        }

        if (worldItem.name === 'room') {
            return new RoomFactory(this.scene).createItem(worldItem);
        }

        if (!meshDescriptor.model) {
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
                return new DoorFactory(this.scene, MeshBuilder).createItem(worldItem, meshDescriptor, meshTemplate);
            case 'window':
                return new WindowFactory(this.scene, MeshBuilder,  new MaterialFactory(this.scene)).createItem(worldItem, meshDescriptor, meshTemplate);
            default:
                return new ModelFactoryOld(this.scene, MeshBuilder).getInstance(worldItem, meshDescriptor, meshTemplate);
        }
    }

    private createFromShapeDescriptor(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition): Mesh[] {
        switch(meshDescriptor.shape) {
            case 'disc':
                return [new DiscFactory(this.scene, MeshBuilder, MaterialBuilder).createItem(worldItemInfo, meshDescriptor)]
            case 'plane':
                return [this.createPlane(worldItemInfo, meshDescriptor)];
            case 'rect':
                return [new RectangleFactory(this.scene, new MaterialFactory(this.scene)).createItem(worldItemInfo, meshDescriptor)];
            default:
                throw new Error('Unsupported shape: ' + meshDescriptor.shape);
        }
    }

    private createPlane(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition): Mesh {
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

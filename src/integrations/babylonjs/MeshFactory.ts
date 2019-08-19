
import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, Skeleton, Space, StandardMaterial, Vector3, Axis, DynamicTexture, Texture } from 'babylonjs';
import { WorldItemInfo } from '../../WorldItemInfo';
import { MeshTemplate } from '../api/MeshTemplate';
import { EmptyAreaFactory } from './factories/EmptyAreaFactory';
import { PlayerFactory } from './factories/PlayerFactory';
import { DoorFactory } from './factories/DoorFactory';
import { WindowFactory } from './factories/WindowFactory';
import { WallFactory } from './factories/WallFactory';
import { RoomFactory } from './factories/RoomFactory';
import { DiscFactory } from './shape_factories/DiscFactory';
import { MaterialBuilder } from './MaterialBuilder';

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

export interface FileDescriptor {
    name: 'file-descriptor'
    path: string;
    fileName: string;
    materials?: string[];
    scale: number;
    translateY?: number;
}

export interface ShapeDescriptor {
    name: 'shape-descriptor';
    shape: 'plane' | 'disc';
    materials?: string[];
    translateY?: number;
}

export interface RoomDescriptor {
    name: 'room-descriptor';
    floorMaterialPath?: string;
    roofMaterialPath?: string;
    roofY: number;
}

export interface MeshDescriptor {
    name: 'mesh-descriptor';
    type: string;
    translateY?: number;
    details: FileDescriptor | ShapeDescriptor | RoomDescriptor
}

export interface MultiModelDescriptor {
    name: 'multi-model-descriptor';
    type: string;
    details: FileDescriptor[] | ShapeDescriptor[]
}

export class MeshFactory {
    private scene: Scene;
    private modelMap: Map<string, MeshTemplate<Mesh, Skeleton>> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public setMeshTemplates(map: Map<string, MeshTemplate<Mesh, Skeleton>>) {
        this.modelMap = map;
    }

    public createFromTemplate(worldItemInfo: WorldItemInfo, meshTemplate: MeshTemplate<Mesh, Skeleton>, meshDescriptor: MeshDescriptor): Mesh[] {

        switch(worldItemInfo.name) {
            case 'root':
                return [];
            case 'empty':
                return [new EmptyAreaFactory(this.scene).createItem(worldItemInfo)];
            case 'player':
                worldItemInfo.skeleton = meshTemplate.skeletons[0];
                return [new PlayerFactory().createItem(worldItemInfo, meshTemplate)];
            case 'door':
                return [new DoorFactory(this.scene, MeshBuilder).createItem(worldItemInfo, meshTemplate)];
            case 'window':
                return [new WindowFactory(this.scene, MeshBuilder).createItem(worldItemInfo, meshDescriptor, meshTemplate)];
            case 'wall':
                return [new WallFactory(this.scene).createItem(worldItemInfo)];
            default:
                return [this.create(worldItemInfo, meshTemplate)];
        }
    }

    private create(worldItemInfo: WorldItemInfo, meshTemplate: MeshTemplate<Mesh, Skeleton>) {
        const meshes = meshTemplate.meshes.map(m => m.clone());
        const rotation = - worldItemInfo.rotation;
        meshes[0].isVisible = true;

        meshes[0].rotate(Axis.Y, rotation, Space.WORLD);
        const mesh = this.createMesh(worldItemInfo, meshes[0], this.scene);
        mesh.checkCollisions = true;
        mesh.isVisible = false;

        const impostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 2, friction: 1, restitution: 0.3 }, this.scene);
        mesh.physicsImpostor = impostor;

        return mesh;
    }

    public createFromMeshDescriptor(worldItemInfo: WorldItemInfo, meshDescriptor: MeshDescriptor): Mesh[] {
        // TODO: get rid of this at some point
        if (worldItemInfo.name === 'root' || worldItemInfo.name === 'empty' || worldItemInfo.name === 'wall') {
            return this.createFromTemplate(worldItemInfo, null, meshDescriptor);
        }

        switch(meshDescriptor.details.name) {
            case 'room-descriptor':
                return this.createRoomMeshes(worldItemInfo, meshDescriptor.details);
            case 'shape-descriptor':
                return this.createFromShapeDescriptor(worldItemInfo, meshDescriptor.details);
            case 'file-descriptor':
                return this.createFromTemplate(worldItemInfo, this.modelMap.get(worldItemInfo.name), meshDescriptor);
            default:
                return null;
        }
    }

    private createRoomMeshes(worldItemInfo: WorldItemInfo, roomDescriptor: RoomDescriptor): Mesh[] {
        return new RoomFactory(this.scene).createItem(worldItemInfo, roomDescriptor);
    }

    private createFromShapeDescriptor(worldItemInfo: WorldItemInfo, shapeDescriptor: ShapeDescriptor): Mesh[] {
        switch(shapeDescriptor.shape) {
            case 'disc':
                return [new DiscFactory(this.scene, MeshBuilder, MaterialBuilder).createItem(worldItemInfo, shapeDescriptor)]
            case 'plane':
                return [this.createPlane(worldItemInfo, shapeDescriptor)];
            default:
                throw new Error('Unsupported shape: ' + shapeDescriptor.shape);
        }
    }

    private createPlane(worldItemInfo: WorldItemInfo, shapeDescriptor: ShapeDescriptor): Mesh {
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

        if (shapeDescriptor.materials) {
            roomTop.material = this.createMaterial('room1', shapeDescriptor.materials[0]);
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

    private createMesh(worldItemInfo: WorldItemInfo, mesh: Mesh, scene: Scene): Mesh {
        const boundingPolygon = worldItemInfo.dimensions;
        const height = mesh.getBoundingInfo().boundingBox.maximumWorld.y;

        const box = MeshBuilder.CreateBox(
            `bounding-box`,
            {  width: boundingPolygon.getBoundingInfo().extent[0], depth: boundingPolygon.getBoundingInfo().extent[1], height: height  },
            scene
        );

        mesh.parent = box;

        const center = boundingPolygon.getBoundingCenter();
        box.translate(new Vector3(center.x, 0, center.y), 1, Space.WORLD);

        const material = new StandardMaterial('box-material', scene);
        material.diffuseColor = Color3.FromHexString('#00FF00');
        material.alpha = 0.5;
        material.wireframe = false;
        box.material = material;
        box.isVisible = true;

        return box;
    }
}

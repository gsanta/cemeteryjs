
import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, Skeleton, Space, StandardMaterial, Vector3, Axis, DynamicTexture, Texture } from 'babylonjs';
import { WorldItemInfo } from '../../WorldItemInfo';
import { WorldItemBoundingBoxCalculator } from './factories/utils/WorldItemBoundingBoxCalculator';
import { MeshTemplate } from '../api/MeshTemplate';
import { EmptyAreaFactory } from './factories/EmptyAreaFactory';
import { PlayerFactory } from './factories/PlayerFactory';
import { DoorFactory } from './factories/DoorFactory';
import { WindowFactory } from './factories/WindowFactory';
import { WallFactory } from './factories/WallFactory';
import { RoomFactory } from './factories/RoomFactory';

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
}

export interface ShapeDescriptor {
    name: 'shape-descriptor';
    shape: 'plane';
    materials?: string[];
    translateY?: number;
}

export interface MeshDescriptor {
    name: 'mesh-descriptor';
    type: string;
    details: FileDescriptor | ShapeDescriptor
}

export interface MultiModelDescriptor {
    name: 'multi-model-descriptor';
    type: string;
    details: FileDescriptor[] | ShapeDescriptor[]
}

export class MeshFactory {
    private scene: Scene;
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(worldItemInfo: WorldItemInfo, meshInfo: [Mesh[], Skeleton[]]): Mesh {
        const meshes = meshInfo[0].map(m => m.clone());
        let boundingBox = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);
        const rotation = - worldItemInfo.rotation;
        meshes[0].isVisible = true;

        meshes[0].rotate(Axis.Y, rotation, Space.WORLD);
        boundingBox = boundingBox.negate('y');
        worldItemInfo.dimensions = boundingBox;
        const mesh = this.createMesh(worldItemInfo, meshes[0], this.scene);
        mesh.checkCollisions = true;
        mesh.isVisible = false;

        const impostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 2, friction: 1, restitution: 0.3 }, this.scene);
        mesh.physicsImpostor = impostor;

        return mesh;
    }

    public createFromTemplate(worldItemInfo: WorldItemInfo, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh {

        switch(worldItemInfo.name) {
            case 'root':
                return null;
            case 'empty':
                return new EmptyAreaFactory(this.scene).createItem(worldItemInfo);
            case 'player':
                worldItemInfo.skeleton = meshTemplate.skeletons[0];
                return new PlayerFactory().createItem(worldItemInfo, meshTemplate)
            case 'door':
                return new DoorFactory(this.scene, MeshBuilder).createItem(worldItemInfo, meshTemplate);
            case 'window':
                return new WindowFactory(this.scene, MeshBuilder).createItem(worldItemInfo, meshTemplate);
            case 'wall':
                return new WallFactory(this.scene).createItem(worldItemInfo);
            case 'room':
                return new RoomFactory(this.scene).createItem(worldItemInfo);
            default:
                return this.create(worldItemInfo, meshTemplate);
        }
    }

    private create(worldItemInfo: WorldItemInfo, meshTemplate: MeshTemplate<Mesh, Skeleton>) {
        const meshes = meshTemplate.meshes.map(m => m.clone());
        let boundingBox = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);
        const rotation = - worldItemInfo.rotation;
        meshes[0].isVisible = true;

        meshes[0].rotate(Axis.Y, rotation, Space.WORLD);
        boundingBox = boundingBox.negate('y');
        worldItemInfo.dimensions = boundingBox;
        const mesh = this.createMesh(worldItemInfo, meshes[0], this.scene);
        mesh.checkCollisions = true;
        mesh.isVisible = false;

        const impostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 2, friction: 1, restitution: 0.3 }, this.scene);
        mesh.physicsImpostor = impostor;

        return mesh;
    }

    public createFromShapeDescriptor(worldItemInfo: WorldItemInfo, shapeDescriptor: ShapeDescriptor) {
        switch(shapeDescriptor.shape) {
            case 'plane':
                return this.createPlane(worldItemInfo, shapeDescriptor);
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

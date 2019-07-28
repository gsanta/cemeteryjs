import { Mesh, MeshBuilder, PhysicsImpostor, Scene, Vector3 } from '@babylonjs/core';
import { Shape } from '@nightshifts.inc/geometry';
import { RoomLabelFactory } from './RoomLabelFactory';
import { WorldItemBoundingBoxCalculator } from './utils/WorldItemBoundingBoxCalculator';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { MeshCreator } from '../MeshCreator';

export class RoomFactory implements MeshCreator  {
    private scene: Scene;
    private roomLabelFactory: RoomLabelFactory;
    private counter = 1;
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator = new WorldItemBoundingBoxCalculator();

    constructor(scene: Scene) {
        this.scene = scene;
        this.roomLabelFactory = new RoomLabelFactory(scene);
    }

    public createItem(worldItemInfo: WorldItemInfo): Mesh {
        worldItemInfo.dimensions = this.worldItemBoundingBoxCalculator.getBoundingBox(worldItemInfo);

        const dimensions  = worldItemInfo.dimensions.negate('y')

        const mesh = this.createRoomFloor(dimensions);
        mesh.receiveShadows = true;

        const impostor = new PhysicsImpostor(mesh, PhysicsImpostor.PlaneImpostor, { mass: 0, friction: 1, restitution: 0.7 }, this.scene);
        mesh.physicsImpostor = impostor;
        mesh.isVisible = true;


        // const label = `room-${this.counter++}`;
        // const roomLabel = this.roomLabelFactory.createItem(worldItemInfo);
        // roomLabel.isVisible = false;

        return mesh;
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

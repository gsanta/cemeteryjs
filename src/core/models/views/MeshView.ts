import { Mesh, Vector3, Axis, Space } from 'babylonjs';
import { IGameObject } from '../../../game/models/objects/IGameObject';
import { BehaviourType } from '../../../game/services/behaviour/IBehaviour';
import { GamepadEvent } from '../../../game/services/GameEventManager';
import { Point } from '../../geometry/shapes/Point';
import { Rectangle } from '../../geometry/shapes/Rectangle';
import { toVector3 } from '../../geometry/utils/GeomUtils';
import { toDegree } from '../../geometry/utils/Measurements';
import { VisualConcept } from '../concepts/VisualConcept';
import { AnimationConcept, ElementalAnimation } from '../meta/AnimationConcept';
import { ConceptType } from './View';
import { MeshModel } from '../models/MeshModel';

export enum WorldItemShape {
    RECTANGLE = 'rect',
    MODEL = 'model'
}

export interface Animation {
    name: string;
    range: [number, number];
}

export enum AnimationName {
    None = 'none',
    Walk = 'walk',
    Turn = 'turn'
}

export enum AnimationState {
    Playing = 'playing',
    Paused = 'paused',
    Stopped = 'stopped'
}


export class MeshView extends VisualConcept implements IGameObject {
    type = ConceptType.MeshConcept;
    mesh: Mesh;

    model: MeshModel;

    meshName: string;
    id: string;
    dimensions: Rectangle;
    rotation: number;
    children: MeshView[] = [];
    parent: MeshView;
    modelId: string;
    routeId: string;
    thumbnailPath: string;
    path: string;
    isManualControl: boolean;

    color: string;
    scale: number;
    yPos: number = 0;

    speed = 0.1;

    activeBehaviour: BehaviourType;
    activeElementalAnimation: ElementalAnimation;
    actions: string[] = [
        GamepadEvent.Forward,
        GamepadEvent.Backward,
        GamepadEvent.TurnLeft,
        GamepadEvent.TurnRight
    ];
    animation: AnimationConcept;
    animations: string[] = ['animation1'];
    animationState = AnimationState.Playing;
    animationId: string;
    layer: number = 10;

    constructor(dimensions: Rectangle, name: string, rotation = 0) {
        super();
        this.dimensions = dimensions;
        this.id = name;
        this.rotation = rotation;
        this.model = new MeshModel(this);
    }

    addChild(worldItem: MeshView) {
        this.children.push(worldItem);
    }

    equalTo(worldItem: MeshView) {
        return (
            this.id === worldItem.id &&
            this.dimensions.equalTo(worldItem.dimensions) &&
            this.rotation === worldItem.rotation
        );
    }

    getDirection(): Point {
        return new Point(Math.sin(this.getRotation()), Math.cos(this.getRotation()));
    }

    setDirection(newDir: Point): void {
        const currentDir = this.getDirection();
        const angle1 = Math.atan2(newDir.y, newDir.x) - Math.atan2(currentDir.y, currentDir.x);
        console.log(toDegree(angle1));
        const angle2 = Math.atan2(currentDir.y, currentDir.x) - Math.atan2(newDir.y, newDir.x);
        const angle = Math.min(angle1, angle2);
        this.rotation += angle;
    }

    getPosition(): Point {
        return this.mesh ? to2DPoint(this.mesh.getAbsolutePosition()) : this.dimensions.getBoundingCenter();
    }

    setPosition(point: Point) {
        this.mesh && this.mesh.setAbsolutePosition(toVector3(point.negateY().div(10), this.yPos));
    }

    moveForward(vector: Point): void {
        this.dimensions.translate(vector);

        this.mesh && this.mesh.translate(Axis.Z, 1, Space.LOCAL);
    }

    moveBackward(vector: Point): void {
        this.dimensions.translate(vector);

        this.mesh && this.mesh.translate(Axis.Z, -1, Space.LOCAL);
    }

    getRotation(): number {
        const rotation = this.mesh ? this.mesh.rotation.y : this.rotation;

        return rotation;
    }

    rotateBy(rad: number) {
        if (this.mesh) {
            this.mesh.rotation.y += rad;
        } else {
            this.rotation += rad;
        }
    }

    setRotation(angle: number) {
        if (this.mesh) {
            this.mesh.rotation.y = - angle;
        } else {
            this.rotation = angle;
        }
    }

    selectHoveredSubview() {}

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }

    dispose() {}
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}


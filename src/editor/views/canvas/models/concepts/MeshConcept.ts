import { Mesh, Vector3 } from 'babylonjs';
import { MeshStore } from '../../../../../game/models/stores/MeshStore';
import { BehaviourType } from '../../../../../game/services/behaviour/IBehaviour';
import { Point } from '../../../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../../../misc/geometry/shapes/Rectangle';
import { toVector3 } from '../../../../../misc/geometry/utils/GeomUtils';
import { toDegree } from '../../../../../misc/geometry/utils/Measurements';
import { EditPoint } from '../feedbacks/EditPoint';
import { ConceptType } from './Concept';
import { VisualConcept } from './VisualConcept';

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


export class MeshConcept implements VisualConcept {
    type = ConceptType.MeshConcept;
    editPoints = [];
    mesh: Mesh;

    meshName: string;
    id: string;
    dimensions: Rectangle;
    rotation: number;
    children: MeshConcept[] = [];
    parent: MeshConcept;
    modelId: string;
    thumbnailPath: string;
    path: string;
    isManualControl: boolean;

    color: string;
    scale: number;

    speed = 0.1;

    activeBehaviour: BehaviourType;
    animations: string[] = [];
    animationState = AnimationState.Playing;
    animationId: string;
    layer: number = 10;

    constructor(dimensions: Rectangle, name: string, rotation = 0) {
        this.dimensions = dimensions;
        this.id = name;
        this.rotation = rotation;
    }

    addChild(worldItem: MeshConcept) {
        this.children.push(worldItem);
    }

    equalTo(worldItem: MeshConcept) {
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

    moveBy(vector: Point): void {
        if (this.mesh) {
            this.mesh.translate(toVector3(vector), 1) //moveWithCollisions(toVector3(vector));
        } else {
            this.dimensions.translate(vector);
        }
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

    selectHoveredSubview() {}
    moveEditPoint(editPoint: EditPoint, delta: Point) {}

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }

    deleteEditPoint(editPoint: EditPoint): void {}
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}


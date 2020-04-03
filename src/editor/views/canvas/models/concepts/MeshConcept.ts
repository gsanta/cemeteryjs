import { Mesh, Vector3 } from 'babylonjs';
import { MeshStore } from '../../../../../game/models/stores/MeshStore';
import { BehaviourType } from '../../../../../game/services/behaviour/IBehaviour';
import { Point } from '../../../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../../../misc/geometry/shapes/Rectangle';
import { toVector3 } from '../../../../../misc/geometry/utils/GeomUtils';
import { EditPoint } from '../feedbacks/EditPoint';
import { Feedback } from '../feedbacks/Feedback';
import { Concept, ConceptType } from './Concept';

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


export class MeshConcept implements Concept {
    type = ConceptType.MeshConcept;
    editPoints = [];
    meshName: string;
    id: string;
    dimensions: Rectangle;
    rotation: number;
    children: MeshConcept[] = [];
    parent: MeshConcept;
    texturePath: string;
    modelPath: string;
    modelData: string;
    thumbnailPath: string;
    path: string;
    isManualControl: boolean;

    color: string;
    scale: number;

    speed = 0.01;

    activeAnimation: string;
    activeBehaviour: BehaviourType;
    wanderAngle = 0;
    animations: string[] = [];
    animationState = AnimationState.Playing;
    animationId: string;
    layer: number = 10;
    private getMesh: (meshName: string) => Mesh;

    constructor(getMesh: (meshName: string) => Mesh, dimensions: Rectangle, name: string, rotation = 0) {
        this.getMesh = getMesh;
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

    getAnimationByName(animationName: AnimationName, meshStore: MeshStore): Animation {
        return this.getAnimations(meshStore).find(anim => anim.name === animationName);
    }

    getDirection(): Point {
        return new Point(Math.sin(this.getRotation()), Math.cos(this.getRotation()));
    }

    setDirection(newDir: Point): void {
        const currentDir = this.getDirection();
        const angle1 = Math.atan2(newDir.y, newDir.x) - Math.atan2(currentDir.y, currentDir.x);
        const angle2 = Math.atan2(currentDir.y, currentDir.x) - Math.atan2(newDir.y, newDir.x);
        const angle = Math.min(angle1, angle2);
        this.rotation += angle;
    }

    getPosition(): Point {
        return this.getMesh(this.meshName) ?  to2DPoint(this.getMesh(this.meshName).getAbsolutePosition()) : this.dimensions.getBoundingCenter();
    }

    moveBy(vector: Point): void {
        if (this.getMesh(this.meshName)) {
            this.getMesh(this.meshName).translate(toVector3(vector), 1) //moveWithCollisions(toVector3(vector));
        } else {
            this.dimensions.translate(vector);
        }
    }

    getRotation(): number {
        const rotation = this.getMesh(this.meshName) ? this.getMesh(this.meshName).rotation.y : this.rotation;

        return rotation;
    }

    rotateBy(rad: number) {
        if (this.getMesh(this.meshName)) {
            this.getMesh(this.meshName).rotation.y += rad;
        } else {
            this.rotation += rad;
        }
    }

    selectHoveredSubview() {}
    deleteEditPoint(feedback: Feedback): void {}

    moveEditPoint(editPoint: EditPoint, delta: Point) {}

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }

    private getAnimations(meshStore: MeshStore): Animation[] {
        return meshStore.getMesh(this.id).skeleton.getAnimationRanges().map(anim => ({
            name: anim.name,
            range: [anim.from, anim.to]
        }));
    }
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}


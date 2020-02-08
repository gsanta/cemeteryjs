
import { ViewType } from "../../../model/View";
import { GroupContext } from "../../../model/views/GroupContext";
import { Rectangle } from "../../../model/geometry/shapes/Rectangle";
import { GameObject, AnimationName } from "../../../world_generator/services/GameObject";
import { BehaviourType } from "../../services/behaviour/IBehaviour";
import { Mesh } from "babylonjs/Meshes/mesh";
import { Point } from "../../../model/geometry/shapes/Point";
import { toVector3 } from "../../../model/geometry/utils/GeomUtils";
import { Vector3 } from "babylonjs";
import { IGameObject, GameObjectType } from "./IGameObject";


export class MeshObject implements IGameObject {
    objectType = GameObjectType.MeshObject;
    groupContext: GroupContext;
    type: string;
    meshName: string;
    name: string;
    dimensions: Rectangle;
    rotation: number = 0;
    children: GameObject[] = [];
    parent: GameObject;
    texturePath: string;
    modelPath: string;
    thumbnailPath: string;
    path: string;

    color: string;
    scale: number;

    speed = 0.01;

    activeAnimation: string;
    activeBehaviour: BehaviourType;
    wanderAngle = 0;
    private getMesh: (meshName: string) => Mesh;

    constructor(getMesh: (meshName: string) => Mesh) {
        this.getMesh = getMesh;
        this.name = name;
        this.groupContext = new GroupContext();
    }

    addChild(worldItem: GameObject) {
        this.children.push(worldItem);
    }

    equalTo(worldItem: GameObject) {
        return (
            this.name === worldItem.name &&
            this.dimensions.equalTo(worldItem.dimensions) &&
            this.rotation === worldItem.rotation
        );
    }

    // getAnimationByName(animationName: AnimationName, meshStore: MeshStore): Animation {
    //     return this.getAnimations(meshStore).find(anim => anim.name === animationName);
    // }

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
            this.getMesh(this.meshName).moveWithCollisions(toVector3(vector));
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

    // private getAnimations(meshStore: MeshStore): Animation[] {
    //     return meshStore.getMesh(this.name).skeleton.getAnimationRanges().map(anim => ({
    //         name: anim.name,
    //         range: [anim.from, anim.to]
    //     }));
    // }
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}

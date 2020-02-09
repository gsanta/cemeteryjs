
import { Vector3 } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { Point } from "../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { toVector3 } from "../../../misc/geometry/utils/GeomUtils";
import { BehaviourType } from "../../services/behaviour/IBehaviour";
import { GameObjectType, IGameObject } from "./IGameObject";
import { GroupContext } from "../../../common/views/GroupContext";
import { RouteObject } from "./RouteObject";

export class MeshObject implements IGameObject {
    readonly objectType = GameObjectType.MeshObject;
    groupContext: GroupContext;
    type: string;
    meshName: string;
    name: string;
    dimensions: Rectangle;
    rotation: number = 0;
    children: MeshObject[] = [];
    parent: MeshObject;
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
    private getRouteFunc: () => RouteObject;

    constructor(getMesh: (meshName: string) => Mesh, getRoute: () => RouteObject) {
        this.getMesh = getMesh;
        this.name = name;
        this.groupContext = new GroupContext();
        this.getRouteFunc = getRoute;
    }

    addChild(meshObject: MeshObject) {
        this.children.push(meshObject);
    }

    equalTo(meshObject: MeshObject) {
        return (
            this.name === meshObject.name &&
            this.dimensions.equalTo(meshObject.dimensions) &&
            this.rotation === meshObject.rotation
        );
    }

    setPosition(point: Point) {
        const mesh = this.getMesh(this.name); 
        mesh.setAbsolutePosition(toVector3(point));
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

    getRoute(): RouteObject {
        return this.getRouteFunc();
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

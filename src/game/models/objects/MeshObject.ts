
import { Vector3 } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { Point } from "../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { toVector3 } from "../../../misc/geometry/utils/GeomUtils";
import { BehaviourType } from "../../services/behaviour/IBehaviour";
import { GameObjectType, IGameObject } from "./IGameObject";
import { RouteObject } from "./RouteObject";
import { AnimationConcept, ElementalAnimation } from "../../../editor/views/canvas/models/meta/AnimationConcept";



export class MeshObject implements IGameObject {
    readonly objectType = GameObjectType.MeshObject;
    type: string;
    meshName: string;
    id: string;
    dimensions: Rectangle;
    rotation: number = 0;
    children: MeshObject[] = [];
    parent: MeshObject;
    texturePath: string;
    modelPath: string;
    thumbnailPath: string;
    path: string;
    isManualControl: boolean;

    color: string;
    scale: number;

    speed = 0.01;

    activeBehaviour: BehaviourType;
    wanderAngle = 0;
    animation: AnimationConcept;
    activeElementalAnimation: ElementalAnimation;
    private getMesh: (meshName: string) => Mesh;
    private getRouteFunc: () => RouteObject;

    constructor(getMesh: (meshName: string) => Mesh, getRoute: () => RouteObject) {
        this.getMesh = getMesh;
        this.id = name;
        this.getRouteFunc = getRoute;
    }

    hasMesh() {
        return this.getMesh(this.id);
    }

    addChild(meshObject: MeshObject) {
        this.children.push(meshObject);
    }

    equalTo(meshObject: MeshObject) {
        return (
            this.id === meshObject.id &&
            this.dimensions.equalTo(meshObject.dimensions) &&
            this.rotation === meshObject.rotation
        );
    }

    setPosition(point: Point) {
        const mesh = this.getMesh(this.id); 
        mesh.setAbsolutePosition(toVector3(point));
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
            this.getMesh(this.meshName).translate(toVector3(vector), 1);
        } else {
            this.dimensions.translate(vector);
        }
    }

    setRotation(angle: number) {
        if (this.getMesh(this.meshName)) {
            this.getMesh(this.meshName).rotation.y = - angle;
        } else {
            this.rotation = angle;
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
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}

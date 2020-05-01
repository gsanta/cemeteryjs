
import { Vector3 } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";
import { AnimationConcept, ElementalAnimation } from "../../../editor/views/canvas/models/meta/AnimationConcept";
import { Point } from "../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { toVector3 } from "../../../misc/geometry/utils/GeomUtils";
import { BehaviourType } from "../../services/behaviour/IBehaviour";
import { IGameObject } from "./IGameObject";
import { RouteObject } from "./RouteObject";



export class MeshObject implements IGameObject {
    readonly type = ConceptType.MeshConcept;

    private mesh: Mesh;
    meshName: string;
    id: string;
    dimensions: Rectangle;
    rotation: number = 0;
    children: MeshObject[] = [];
    parent: MeshObject;
    texturePath: string;
    modelId: string
    thumbnailPath: string;
    path: string;
    isManualControl: boolean;

    color: string;
    scale: number;

    speed: number;

    activeBehaviour: BehaviourType;
    wanderAngle = 0;
    animation: AnimationConcept;
    activeElementalAnimation: ElementalAnimation;
    private getRouteFunc: () => RouteObject;

    constructor(getRoute: () => RouteObject) {
        this.id = name;
        this.getRouteFunc = getRoute;
    }

    hasMesh() {
        return this.mesh;
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
        this.mesh.setAbsolutePosition(toVector3(point));
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
        return this.mesh ?  to2DPoint(this.mesh.getAbsolutePosition()) : this.dimensions.getBoundingCenter();
    }

    moveBy(vector: Point): void {
        if (this.mesh) {
            console.log(vector)
            this.mesh.translate(toVector3(vector), 1);
        } else {
            this.dimensions.translate(vector);
        }
    }

    setRotation(angle: number) {
        if (this.mesh) {
            this.mesh.rotation.y = - angle;
        } else {
            this.rotation = angle;
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

    getRoute(): RouteObject {
        return this.getRouteFunc();
    }

    setMesh(mesh: Mesh) {
        this.mesh = mesh;
    }

    getMesh(): Mesh {
        return this.mesh;
    }

    dispose() {
        if (this.mesh) {
            if (this.mesh.name.startsWith('template')) {
                this.mesh.isVisible = false;
            } else {
                this.mesh.dispose();
            }
        } 
    }
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}

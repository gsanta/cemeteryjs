import { Mesh, Vector3, Axis, Space, Quaternion } from 'babylonjs';
import { IGameModel } from '../game_objects/IGameModel';
import { Point } from '../../geometry/shapes/Point';
import { Rectangle } from '../../geometry/shapes/Rectangle';
import { toVector3 } from '../../geometry/utils/GeomUtils';
import { toDegree } from '../../geometry/utils/Measurements';
import { ConceptType, View, ViewJson } from './View';
import { MeshModel } from '../game_objects/MeshModel';

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

export interface MeshViewJson extends ViewJson {
    rotation: number;
    modelId: string;
    scale: number;
    yPos: number 
    thumbnailPath: string;
    path: string;
    isManualControl: boolean;
}

export class MeshView extends View implements IGameModel {
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

    color: string = 'grey';
    scale: number;
    yPos: number = 0;

    speed = 0.5;
    animations: string[] = ['animation1'];
    animationState = AnimationState.Playing;
    layer: number = 10;

    constructor(config?: {dimensions?: Rectangle}) {
        super();
        this.dimensions = config && config.dimensions;
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
        this.mesh && this.mesh.setAbsolutePosition(toVector3(point, this.yPos));
    }

    moveForward(amount: number): void {
        // this.dimensions.translate(vector);

        this.mesh && this.mesh.translate(Axis.Z, amount, Space.LOCAL);
    }

    moveBackward(amount: number): void {
        // this.dimensions.translate(vector);

        this.mesh && this.mesh.translate(Axis.Z, amount, Space.LOCAL);
    }

    getRotation(): number {
        if (!this.mesh) {
            return this.rotation;
        }

        return this.mesh.rotationQuaternion ? this.mesh.rotationQuaternion.toEulerAngles().y : this.mesh.rotation.y;
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
            this.mesh.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), angle);
            this.mesh.rotation.y = angle;
        } else {
            this.rotation = angle;
        }
    }

    rotate(angle: number) {
        this.mesh.rotation.y = 0;
        this.mesh.rotate(Axis.Y, angle, Space.LOCAL);
    }

    selectHoveredSubview() {}

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
    }

    dispose() {}

    toJson(): MeshViewJson {
        return {
            ...super.toJson(),
            rotation: this.rotation,
            modelId: this.modelId,
            scale: this.scale,
            yPos: this.yPos,
            thumbnailPath: this.thumbnailPath,
            path: this.path,
            isManualControl: this.isManualControl,
        }
    }

    fromJson(json: MeshViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.rotation = json.rotation;
        this.modelId = this.modelId;
        this.scale = this.scale;
        this.yPos = this.yPos;
        this.thumbnailPath = this.thumbnailPath;
        this.path = this.path;
        this.isManualControl = this.isManualControl;
    }
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}


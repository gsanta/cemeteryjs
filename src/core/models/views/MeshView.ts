import { Mesh, Vector3, Axis, Space, Quaternion } from 'babylonjs';
import { IGameModel } from '../game_objects/IGameModel';
import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { toVector3 } from '../../../utils/geometry/GeomUtils';
import { toDegree } from '../../../utils/geometry/Measurements';
import { ViewType, View, ViewJson } from './View';
import { MeshObj } from '../game_objects/MeshObj';

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
    textureId: string;
    thumbnailId: string;
    scale: number;
    yPos: number 
}

export class MeshView extends View implements IGameModel {
    viewType = ViewType.MeshView;

    obj: MeshObj;

    meshName: string;
    id: string;
    dimensions: Rectangle;
    private rotation: number;
    private scale: number;
    
    thumbnailId: string;

    color: string = 'grey';
    yPos: number = 0;
    speed = 0.5;
    animations: string[] = ['animation1'];
    animationState = AnimationState.Playing;
    layer: number = 10;

    constructor(config?: {dimensions?: Rectangle}) {
        super();
        this.dimensions = config && config.dimensions;
        this.obj = new MeshObj(this);
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
        return this.obj.mesh ? to2DPoint(this.obj.mesh.getAbsolutePosition()) : this.dimensions.getBoundingCenter();
    }

    setPosition(point: Point) {
        this.obj.mesh && this.obj.mesh.setAbsolutePosition(toVector3(point, this.yPos));
    }

    moveForward(amount: number): void {
        // this.dimensions.translate(vector);

        this.obj.mesh && this.obj.mesh.translate(Axis.Z, amount, Space.LOCAL);
    }

    moveBackward(amount: number): void {
        // this.dimensions.translate(vector);

        this.obj.mesh && this.obj.mesh.translate(Axis.Z, amount, Space.LOCAL);
    }

    getRotation(): number {
        return this.rotation;
    }

    rotateBy(rad: number) {
        if (this.obj.mesh) {
            this.obj.mesh.rotation.y += rad;
        } else {
            this.rotation += rad;
        }
    }

    setRotation(angle: number) {
        this.rotation = angle;
        this.obj.setRotation(angle);
    }

    rotate(angle: number) {
        this.obj.mesh.rotation.y = 0;
        this.obj.mesh.rotate(Axis.Y, angle, Space.LOCAL);
    }

    setScale(scale: number) {
        this.scale = scale;
        this.obj.setScale(scale);
    }

    getScale(): number {
        return this.scale;
    }

    selectHoveredSubview() {}

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        if (this.obj.mesh) {
            const rect = <Rectangle> this.dimensions.div(10);
            this.obj.mesh.setAbsolutePosition(new Vector3(rect.topLeft.x + rect.getWidth() / 2, 0, -rect.topLeft.y - rect.getHeight() / 2));
        }
    }

    dispose() {}

    toJson(): MeshViewJson {
        return {
            ...super.toJson(),
            rotation: this.rotation,
            modelId: this.obj.modelId,
            textureId: this.obj.textureId,
            thumbnailId: this.thumbnailId,
            scale: this.scale,
            yPos: this.yPos,
        }
    }

    fromJson(json: MeshViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.rotation = json.rotation;
        this.obj.modelId = json.modelId;
        this.scale = json.scale;
        this.yPos = json.yPos;
        this.obj.textureId = json.textureId;
        this.thumbnailId = json.thumbnailId;
    }
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}


import { Mesh, Vector3, Axis, Space, Quaternion } from 'babylonjs';
import { IGameModel } from '../game_objects/IGameModel';
import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { toVector3 } from '../../../utils/geometry/GeomUtils';
import { toDegree } from '../../../utils/geometry/Measurements';
import { ViewType, View, ViewJson } from './View';
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
    textureId: string;
    thumbnailId: string;
    scale: number;
    yPos: number 
    path: string;
    isManualControl: boolean;
}

export class MeshView extends View implements IGameModel {
    viewType = ViewType.MeshView;
    mesh: Mesh;

    model: MeshModel;

    meshName: string;
    id: string;
    dimensions: Rectangle;
    private rotation: number;
    private scale: number;
    
    children: MeshView[] = [];
    parent: MeshView;
    modelId: string;
    textureId: string;
    thumbnailId: string;
    routeId: string;
    path: string;
    isManualControl: boolean;

    color: string = 'grey';
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
        return this.rotation;
    }

    rotateBy(rad: number) {
        if (this.mesh) {
            this.mesh.rotation.y += rad;
        } else {
            this.rotation += rad;
        }
    }

    setRotation(angle: number) {
        this.rotation = angle;
        this.model.setRotation(angle);
    }

    rotate(angle: number) {
        this.mesh.rotation.y = 0;
        this.mesh.rotate(Axis.Y, angle, Space.LOCAL);
    }

    setScale(scale: number) {
        this.scale = scale;
        this.model.setScale(scale);
    }

    getScale(): number {
        return this.scale;
    }

    selectHoveredSubview() {}

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        if (this.mesh) {
            const rect = <Rectangle> this.dimensions.div(10);
            this.mesh.setAbsolutePosition(new Vector3(rect.topLeft.x + rect.getWidth() / 2, 0, -rect.topLeft.y - rect.getHeight() / 2));
        }
    }

    dispose() {}

    toJson(): MeshViewJson {
        return {
            ...super.toJson(),
            rotation: this.rotation,
            modelId: this.modelId,
            textureId: this.textureId,
            thumbnailId: this.thumbnailId,
            scale: this.scale,
            yPos: this.yPos,
            path: this.path,
            isManualControl: this.isManualControl,
        }
    }

    fromJson(json: MeshViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.rotation = json.rotation;
        this.modelId = json.modelId;
        this.scale = json.scale;
        this.yPos = json.yPos;
        this.textureId = json.textureId;
        this.thumbnailId = json.thumbnailId;
        this.path = this.path;
        this.isManualControl = this.isManualControl;
    }
}

function to2DPoint(vector3: Vector3): Point {
    return new Point(vector3.x, vector3.z);
}


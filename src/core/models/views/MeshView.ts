import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { Registry } from '../../Registry';
import { IGameModel } from '../game_objects/IGameModel';
import { MeshObj } from '../game_objects/MeshObj';
import { View, ViewJson, ViewType } from './View';

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
    thumbnailData: string;
    scale: number;
    yPos: number 
}

export class MeshView extends View implements IGameModel {
    viewType = ViewType.MeshView;

    obj: MeshObj;

    id: string;
    dimensions: Rectangle;
    private rotation: number;
    private scale: number;
    
    thumbnailData: string;

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
        if (config && config.dimensions) {
            this.obj.setPosition(this.dimensions.getBoundingCenter().div(10));
        }
    }

    getRotation(): number {
        return this.rotation;
    }

    setRotation(angle: number) {
        this.rotation = angle;
        this.obj.rotate(angle);
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

        this.obj.move(point.div(10).negateY());
    }

    dispose() {
        // TODO: later when ObjStores are correctly introduced, dispose obj only when removing from obj store.
        this.obj.dispose();
    }

    toJson(): MeshViewJson {
        return {
            ...super.toJson(),
            rotation: this.rotation,
            modelId: this.obj.modelId,
            textureId: this.obj.textureId,
            thumbnailData: this.thumbnailData,
            scale: this.scale,
            yPos: this.yPos,
        }
    }

    fromJson(json: MeshViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.obj.setPosition(this.dimensions.getBoundingCenter().div(10));
        this.rotation = json.rotation;
        this.obj.modelId = json.modelId;
        this.scale = json.scale;
        this.yPos = json.yPos;
        this.obj.textureId = json.textureId;
        this.thumbnailData = json.thumbnailData;
    }
}


import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { Registry } from '../../Registry';
import { IObj } from '../objs/IObj';
import { MeshObj } from '../objs/MeshObj';
import { View, ViewFactory, ViewJson, ViewType } from './View';

export interface MeshViewJson extends ViewJson {
    rotation: number;
    modelId: string;
    textureId: string;
    thumbnailData: string;
    scale: number;
    yPos: number 
}

export class MeshViewFactory implements ViewFactory {
    viewType = ViewType.MeshView;
    newInstance() { return new MeshView(); }
}

export class MeshView extends View {
    viewType = ViewType.MeshView;

    protected obj: MeshObj;

    id: string;
    private rotation: number;
    private scale: number;
    
    thumbnailData: string;

    color: string = 'grey';
    yPos: number = 0;
    speed = 0.5;
    layer: number = 10;

    getObj(): MeshObj {
        return this.obj;
    }

    setObj(obj: MeshObj) {
        this.obj = obj;

        this.bounds && this.obj.setPosition(this.bounds.getBoundingCenter().div(10));
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
        this.obj.setScale(new Point(scale, scale));
    }

    getScale(): number {
        return this.scale;
    }

    selectHoveredSubview() {}

    move(point: Point) {
        this.bounds = this.bounds.translate(point);

        this.obj.move(point.div(10).negateY());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
        this.obj.setPosition(this.bounds.getBoundingCenter().div(10));
    }

    dispose() {
        // TODO: later when ObjStores are correctly introduced, dispose obj only when removing from obj store.
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
        this.obj.setPosition(this.bounds.getBoundingCenter().div(10));
        this.rotation = json.rotation;
        this.obj.modelId = json.modelId;
        this.scale = json.scale;
        this.yPos = json.yPos;
        this.obj.textureId = json.textureId;
        this.thumbnailData = json.thumbnailData;
    }
}


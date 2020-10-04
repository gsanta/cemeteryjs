import { Point } from '../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../utils/geometry/shapes/Point_3';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { Registry } from '../../Registry';
import { MeshObj } from '../objs/MeshObj';
import { View, ViewFactory, ViewJson } from './View';

export const MeshViewType = 'mesh-view';

export interface MeshViewJson extends ViewJson {
    rotation: number;
    thumbnailData: string;
    scale: number;
    yPos: number 
}

const MIN_VIEW_SIZE = 20;

export class MeshViewFactory implements ViewFactory {
    viewType = MeshViewType;
    newInstance() { return new MeshView(); }

    renderInto() {

    }
}

export class MeshView extends View {
    viewType = MeshViewType;

    protected obj: MeshObj;

    id: string;
    private rotation: number;
    private scale: number = 1;
    
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

        if (this.bounds) { 
            const pos2 = this.bounds.getBoundingCenter().div(10);
            this.obj.setPosition(new Point_3(pos2.x, this.obj.getPosition().y, pos2.y));
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
        const savedBounds = this.bounds.clone();

        const currentScale = this.getScale();
        this.bounds.scale(new Point(1 / currentScale, 1 / currentScale));
        this.bounds.scale(new Point(scale, scale));

        if (this.bounds.getWidth() < MIN_VIEW_SIZE || this.bounds.getHeight() < MIN_VIEW_SIZE) {
            this.bounds = savedBounds;
        } else {
            this.children.forEach(child => child.calcBounds());
            this.scale = scale;
        }
        
        this.obj.setScale(new Point(scale, scale));
    }

    getScale(): number {
        return this.scale;
    }

    getYPos() {
        return this.yPos;
    }

    selectHoveredSubview() {}

    move(point: Point) {
        this.bounds = this.bounds.translate(point);

        const point2 = point.div(10).negateY();
        this.obj.move(new Point_3(point2.x, this.obj.getPosition().y, point2.y));
        this.children.forEach(child => child.calcBounds());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(bounds: Rectangle) {
        const center = bounds.getBoundingCenter();
        this.bounds = bounds;

        const pos2 = this.bounds.getBoundingCenter().div(10);
        const objPos = this.obj.getPosition();
        
        // TODO: fix this mess, it can break easily, causing infinite loop
        if (this.bounds.getBoundingCenter() !== center) {
            this.obj.setPosition(new Point_3(pos2.x, objPos ? objPos.y : 0, pos2.y));
        }
        this.children.forEach(child => child.calcBounds());
    }


    dispose() {
        // TODO: later when ObjStores are correctly introduced, dispose obj only when removing from obj store.
    }

    toJson(): MeshViewJson {
        return {
            ...super.toJson(),
            rotation: this.rotation,
            thumbnailData: this.thumbnailData,
            scale: this.scale,
            yPos: this.yPos,
        }
    }

    fromJson(json: MeshViewJson, registry: Registry) {
        super.fromJson(json, registry);
        const point2 = this.bounds.getBoundingCenter().div(10).negateY()
        this.obj.setPosition(new Point_3(point2.x, this.obj.getPosition().y, point2.y));
        this.rotation = json.rotation;
        this.scale = json.scale;
        this.yPos = json.yPos;
        this.thumbnailData = json.thumbnailData;
    }
}


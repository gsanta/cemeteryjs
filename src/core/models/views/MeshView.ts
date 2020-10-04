import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { Registry } from '../../Registry';
import { MeshObj } from '../objs/MeshObj';
import { AxisView } from './child_views/AxisView';
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

    setYPos(yPos: number) {
        const savedBounds = this.bounds.clone();

        const diff = yPos === this.yPos ? 0 : (yPos - this.yPos) / 10;
        const scaleFactor = 1 + diff;
        this.bounds.scale(new Point(scaleFactor, scaleFactor));

        if (this.bounds.getWidth() < MIN_VIEW_SIZE || this.bounds.getHeight() < MIN_VIEW_SIZE) {
            this.bounds = savedBounds;
        } else {
            this.children.forEach(child => child.calcBounds());
        }

        this.yPos += diff;
    }


    getYPos() {
        return this.yPos;
    }

    selectHoveredSubview() {}

    move(point: Point) {
        this.bounds = this.bounds.translate(point);

        this.obj.move(point.div(10).negateY());
        this.children.forEach(child => child.calcBounds());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
        this.obj.setPosition(this.bounds.getBoundingCenter().div(10));

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
        this.obj.setPosition(this.bounds.getBoundingCenter().div(10).negateY());
        this.rotation = json.rotation;
        this.scale = json.scale;
        this.yPos = json.yPos;
        this.thumbnailData = json.thumbnailData;
    }
}


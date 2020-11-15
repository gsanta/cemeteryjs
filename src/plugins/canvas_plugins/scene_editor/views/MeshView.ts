import { MeshObj } from '../../../../core/models/objs/MeshObj';
import { View, ViewJson } from '../../../../core/models/views/View';
import { Registry } from '../../../../core/Registry';
import { sceneAndGameViewRatio } from '../../../../core/stores/ViewStore';
import { colors } from '../../../../core/ui_components/react/styles';
import { Point } from '../../../../utils/geometry/shapes/Point';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';
import { Rectangle } from '../../../../utils/geometry/shapes/Rectangle';
import { MeshViewRenderer } from './MeshViewRenderer';

export const MeshViewType = 'mesh-view';

export interface MeshViewJson extends ViewJson {
    rotation: number;
    thumbnailData: string;
    scale: number;
    yPos: number;
    color: string;
}

const MIN_VIEW_SIZE = 20;

export class MeshView extends View {
    viewType = MeshViewType;

    protected obj: MeshObj;

    id: string;
    private rotation: number;
    private scale: number = 1;
    
    thumbnailData: string;

    color: string = colors.pastelBlue;
    yPos: number = 0;
    speed = 0.5;

    constructor() {
        super();
        this.renderer = new MeshViewRenderer();
    }

    getObj(): MeshObj {
        return this.obj;
    }

    setObj(obj: MeshObj) {
        this.obj = obj;

        if (this.bounds) { 
            const pos2 = this.bounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
            this.obj.setPosition(new Point_3(pos2.x, this.obj.getPosition().y, pos2.y));
        }
    }

    getRotation(): number {
        return this.rotation;
    }

    setRotation(angle: number) {
        this.rotation = angle;
        this.obj.setRotation(angle);
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

        const point2 = point.div(sceneAndGameViewRatio).negateY();
        this.obj.move(new Point_3(point2.x, this.obj.getPosition().y, point2.y));
        this.children.forEach(child => child.calcBounds());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(bounds: Rectangle) {
        const center = this.bounds && this.bounds.getBoundingCenter();
        this.bounds = bounds;

        const pos2 = this.bounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        const objPos = this.obj.getPosition();
        
        // TODO: fix this mess, it can break easily, causing infinite loop
        if (!this.bounds.getBoundingCenter().equalTo(center)) {
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
            color: this.color
        }
    }

    fromJson(json: MeshViewJson, registry: Registry) {
        super.fromJson(json, registry);
        const point2 = this.bounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY()
        this.obj.setPosition(new Point_3(point2.x, this.obj.getPosition().y, point2.y));
        this.rotation = json.rotation;
        this.scale = json.scale;
        this.yPos = json.yPos;
        this.thumbnailData = json.thumbnailData;
        this.color = json.color;
    }
}

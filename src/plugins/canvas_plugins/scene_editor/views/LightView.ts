import { LightObj } from "../../../../core/models/objs/LightObj";
import { View, ViewJson } from '../../../../core/models/views/View';
import { Registry } from "../../../../core/Registry";
import { sceneAndGameViewRatio } from '../../../../core/stores/ViewStore';
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from '../../../../utils/geometry/shapes/Rectangle';
import { LightViewRenderer } from "./LightViewRenderer";

export const LightViewType = 'light-view';

export interface LightViewJson extends ViewJson {

}

export class LightView extends View {
    viewType = LightViewType;

    protected obj: LightObj;

    constructor() {
        super();
        this.renderer = new LightViewRenderer();
    }

    getObj(): LightObj {
        return this.obj;
    }

    setObj(obj: LightObj) {
        this.obj = obj;

        if (this.bounds) { 
            const pos2 = this.bounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
            this.obj.setPosition(new Point_3(pos2.x, this.obj.getPosition().y, pos2.y - this.bounds.getHeight() / 2));
        }
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.obj && this.obj.move(new Point_3(point.x, 0, point.y).div(10).negateZ());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {
    }

    toJson(): LightViewJson {
        return {
            ...super.toJson(),
        }
    }

    fromJson(json: ViewJson, registry: Registry) {
        super.fromJson(json, registry);
    }
}
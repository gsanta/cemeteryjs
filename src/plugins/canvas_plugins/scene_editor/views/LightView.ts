import { IGameObj } from "../../../../core/models/objs/IGameObj";
import { IObj } from "../../../../core/models/objs/IObj";
import { LightObj } from "../../../../core/models/objs/LightObj";
import { AfterAllViewsDeserialized, View, ViewJson } from '../../../../core/models/views/View';
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
    private relativeParentPos: Point;

    constructor() {
        super();
        this.renderer = new LightViewRenderer();
    }

    getObj(): LightObj {
        return this.obj;
    }

    setObj(obj: LightObj) {
        this.obj = obj;
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.obj && this.obj.move(new Point_3(point.x, 0, point.y).div(10).negateZ());

        if (this.parentView) {
            this.calcRelativePos();
        }
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {
    }

    calcBounds(): void {
        if (this.parentView) {
            this.bounds.moveCenterTo(this.parentView.getBounds().getBoundingCenter().clone().add(this.relativeParentPos));
        }
    }

    toJson(): LightViewJson {
        return {
            ...super.toJson(),
        }
    }

    setParent(parent: View) {
        super.setParent(parent);
        this.obj.setParent(parent.getObj() as (IObj & IGameObj));
        this.calcRelativePos();
    }

    static fromJson(json: ViewJson, registry: Registry): [View, AfterAllViewsDeserialized] {
        const lightView = new LightView();
        lightView.id = json.id;
        lightView.bounds = json.dimensions && Rectangle.fromString(json.dimensions);

        const obj = <LightObj> registry.stores.objStore.getById(json.objId);
        lightView.setObj(obj);
        const point2 = lightView.getBounds().getBoundingCenter().div(sceneAndGameViewRatio).negateY()
        obj.setPosition(new Point_3(point2.x, obj.getPosition().y, point2.y));
        
        const afterAllViewsDeserialized: AfterAllViewsDeserialized = () => {
            json.childViewIds.map(id => lightView.addChildView(registry.data.view.scene.getById(id)));
            json.parentId && lightView.setParent(registry.data.view.scene.getById(json.parentId));
        }

        return [lightView, afterAllViewsDeserialized];
    }

    private calcRelativePos() {
        this.relativeParentPos = this.getBounds().getBoundingCenter().subtract(this.parentView.getBounds().getBoundingCenter());
    }
}
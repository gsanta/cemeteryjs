import { ILightHook } from "../../../../core/engine/hooks/ILightHook";
import { IGameObj } from "../../../../core/models/objs/IGameObj";
import { IObj } from "../../../../core/models/objs/IObj";
import { LightObj } from "../../../../core/models/objs/LightObj";
import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { View, ViewJson } from '../../../../core/models/views/View';
import { Registry } from "../../../../core/Registry";
import { sceneAndGameViewRatio } from '../../../../core/stores/ViewStore';
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from '../../../../utils/geometry/shapes/Rectangle';
import { LightViewRenderer } from "./LightViewRenderer";
import { MeshView } from "./MeshView";

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

    fromJson(json: ViewJson, registry: Registry) {
        super.fromJson(json, registry);
    }

    private calcRelativePos() {
        this.relativeParentPos = this.getBounds().getBoundingCenter().subtract(this.parentView.getBounds().getBoundingCenter());
    }
}

export class LightHook implements ILightHook {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    hook_setParent(lightObj: LightObj, meshObj: MeshObj) {
        const lightView = this.registry.data.view.scene.getByObjId(lightObj.id);
        const meshView = <MeshView> this.registry.data.view.scene.getByObjId(meshObj.id);

        meshView.addChildView(lightView);
    }
}
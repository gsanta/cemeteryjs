import { IGameObj } from "../../../../../core/models/objs/IGameObj";
import { IObj } from "../../../../../core/models/objs/IObj";
import { LightObj } from "../../../../../core/models/objs/LightObj";
import { AbstractShape, AfterAllViewsDeserialized, ShapeJson } from '../../../../../core/models/views/AbstractShape';
import { Registry } from "../../../../../core/Registry";
import { LightShapeRenderer } from "../../renderers/LightShapeRenderer";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from '../../../../../utils/geometry/shapes/Rectangle';

export const LightShapeType = 'light-shape';

export interface LightShapeJson extends ShapeJson {

}

export class LightShape extends AbstractShape {
    viewType = LightShapeType;

    protected obj: LightObj;
    private relativeParentPos: Point;

    constructor() {
        super();
        this.renderer = new LightShapeRenderer();
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

    toJson(): LightShapeJson {
        return {
            ...super.toJson(),
        }
    }

    setParent(parent: AbstractShape) {
        super.setParent(parent);
        this.obj.setParent(parent.getObj() as (IObj & IGameObj));
        this.calcRelativePos();
    }

    static fromJson(json: ShapeJson, registry: Registry): [AbstractShape, AfterAllViewsDeserialized] {
        const lightView = new LightShape();
        lightView.id = json.id;
        lightView.bounds = json.dimensions && Rectangle.fromString(json.dimensions);

        const obj = <LightObj> registry.stores.objStore.getById(json.objId);
        lightView.setObj(obj);
        
        const afterAllViewsDeserialized: AfterAllViewsDeserialized = () => {
            json.childViewIds.map(id => lightView.addChildView(registry.data.shape.scene.getById(id)));
            json.parentId && lightView.setParent(registry.data.shape.scene.getById(json.parentId));
        }

        return [lightView, afterAllViewsDeserialized];
    }

    private calcRelativePos() {
        this.relativeParentPos = this.getBounds().getBoundingCenter().subtract(this.parentView.getBounds().getBoundingCenter());
    }
}
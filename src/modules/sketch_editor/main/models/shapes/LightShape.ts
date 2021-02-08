import { IGameObj } from "../../../../../core/models/objs/IGameObj";
import { IObj } from "../../../../../core/models/objs/IObj";
import { LightObj } from "../../../../../core/models/objs/LightObj";
import { AbstractShape, AfterAllViewsDeserialized, ShapeJson } from '../../../../../core/models/shapes/AbstractShape';
import { Registry } from "../../../../../core/Registry";
import { LightShapeRenderer } from "../../renderers/LightShapeRenderer";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from '../../../../../utils/geometry/shapes/Rectangle';
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";

export const LightShapeType = 'light-shape';

export interface LightShapeJson extends ShapeJson {

}

export class LightShape extends AbstractShape {
    viewType = LightShapeType;

    protected obj: LightObj;
    private relativeParentPos: Point;

    constructor(obj: LightObj, canvas: Canvas2dPanel) {
        super(canvas);
        this.setObj(obj);
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

    static fromJson(json: ShapeJson, obj: LightObj, canvas: Canvas2dPanel): [AbstractShape, AfterAllViewsDeserialized] {
        const lightView = new LightShape(obj, canvas);
        lightView.id = json.id;
        lightView.bounds = json.dimensions && Rectangle.fromString(json.dimensions);

        
        const afterAllViewsDeserialized: AfterAllViewsDeserialized = () => {
            json.childViewIds.map(id => lightView.addChildView(canvas.data.items.getItemById(id)));
            json.parentId && lightView.setParent(canvas.data.items.getItemById(json.parentId));
        }

        return [lightView, afterAllViewsDeserialized];
    }

    private calcRelativePos() {
        this.relativeParentPos = this.getBounds().getBoundingCenter().subtract(this.parentView.getBounds().getBoundingCenter());
    }
}
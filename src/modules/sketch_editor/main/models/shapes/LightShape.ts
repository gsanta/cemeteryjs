import { IObj } from "../../../../../core/models/objs/IObj";
import { LightObj } from "../../../../../core/models/objs/LightObj";
import { AbstractShape, AfterAllViewsDeserialized, ShapeJson } from '../../../../../core/models/shapes/AbstractShape';
import { LightShapeRenderer } from "../../renderers/LightShapeRenderer";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from '../../../../../utils/geometry/shapes/Rectangle';
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { ObjEventData, ObjEventType } from "../../../../../core/models/ObjObservable";
import { AbstractGameObj } from "../../../../../core/models/objs/AbstractGameObj";

export const LightShapeType = 'light-shape';

export interface LightShapeJson extends ShapeJson {

}

export class LightShape extends AbstractShape {
    viewType = LightShapeType;

    protected obj: LightObj;
    private relativeParentPos: Point;
    private static readonly size = new Point(50, 50);

    constructor(obj: LightObj, canvas: Canvas2dPanel) {
        super(canvas);
        this.setObj(obj);
        this.bounds = new Rectangle(new Point(0, 0), new Point(LightShape.size.x, LightShape.size.y));
        this.renderer = new LightShapeRenderer();

        this.syncPositionFromObj();
    
        canvas.data.items.addItem(this);

        this.obj.observable.add((eventData: ObjEventData) => {
            switch(eventData.eventType) {
                case ObjEventType.PositionChanged:
                    this.syncPositionFromObj();
                break;
            }
        });
    }

    getObj(): LightObj {
        return this.obj;
    }

    setObj(obj: LightObj) {
        this.obj = obj;
    }

    move(point: Point) {
        this._move(point);
        this.syncPositionToObj();
    }

    private _move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.obj && this.obj.move(new Point_3(point.x, 0, point.y).div(10).negateZ());

        if (this.parentView) {
            this.calcRelativePos();
        }
    }

    moveTo(point: Point) {
        this._moveTo(point);
        this.syncPositionToObj();
    }

    private _moveTo(point: Point) {
        this.bounds.moveCenterTo(point);

        this.containedShapes.forEach(child => child.calcBounds());
        this.childShapes.forEach(boundView => boundView.calcBounds());
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
        this.obj.setParent(parent.getObj() as AbstractGameObj);
        this.calcRelativePos();
    }

    private syncPositionFromObj() {
        const objPosition = this.obj.getPosition();
        const viewPos = new Point(objPosition.x, -objPosition.z).scale(sceneAndGameViewRatio);
        this._moveTo(viewPos);
    }

    private syncPositionToObj() {
        const center = this.getBounds().getBoundingCenter();
        const objPos = center.div(sceneAndGameViewRatio).negateY();
        const objPos3 = this.getObj().getPosition();
        this.getObj().setPosition(new Point_3(objPos.x, objPos3.y, objPos.y))
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
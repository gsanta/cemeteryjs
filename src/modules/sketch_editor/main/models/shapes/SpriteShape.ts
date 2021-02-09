import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { ObjEventData, ObjEventType } from "../../../../../core/models/ObjObservable";
import { SpriteObj, SpriteObjJson } from "../../../../../core/models/objs/SpriteObj";
import { AbstractShape, AfterAllViewsDeserialized, ShapeJson } from "../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../core/Registry";
import { colors } from "../../../../../core/ui_components/react/styles";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SpriteShapeRenderer } from "../../renderers/SpriteShapeRenderer";

export const SpriteShapeType = 'sprite-shape';

export interface SpriteShapeJson extends ShapeJson {
    frameName: string;
    thumbnailData: string;
    spriteSheetId: string;
    obj: SpriteObjJson;
}

export class SpriteShape extends AbstractShape {
    viewType = SpriteShapeType;

    color: string = colors.pastelGreen;
    thumbnailData: string;
    protected obj: SpriteObj;

    constructor(obj: SpriteObj, size: Point, canvas: Canvas2dPanel) {
        super(canvas);
        this.setObj(obj);
        this.bounds = new Rectangle(new Point(0, 0), new Point(size.x, size.y));
        this.renderer = new SpriteShapeRenderer();

        this.syncPosition();
    
        canvas.data.items.addItem(this);

        this.obj.observable.add((eventData: ObjEventData) => {
            switch(eventData.eventType) {
                case ObjEventType.PositionChanged:
                    this.syncPosition();
                break;
            }
        });
    }

    moveTo(point: Point) {
        this.bounds.moveCenterTo(point);

        this.containedShapes.forEach(child => child.calcBounds());
        this.childShapes.forEach(boundView => boundView.calcBounds());
    }


    getObj(): SpriteObj {
        return this.obj;
    }

    setObj(obj: SpriteObj) {
        this.obj = obj;
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.obj.move(point.div(10).negateY());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {
    }

    clone(): SpriteShape {
        throw new Error('not implemented')
    }

    toJson(): SpriteShapeJson {
        return {
            ...super.toJson(),
            frameName: this.obj.frameName,
            thumbnailData: this.thumbnailData,
            spriteSheetId: this.obj.spriteSheetId,
            obj: this.obj.serialize()
        }
    }

    private syncPosition() {
        const objPosition = this.obj.getPosition();
        const viewPos = new Point(objPosition.x, -objPosition.y).scale(sceneAndGameViewRatio);
        this.moveTo(viewPos);
    }

    static fromJson(json: SpriteShapeJson, obj: SpriteObj, canvas: Canvas2dPanel): [AbstractShape, AfterAllViewsDeserialized] {
        const bounds = Rectangle.fromString(json.dimensions);
        const spriteShape = new SpriteShape(obj, new Point(bounds.getWidth(), bounds.getHeight()), canvas);
        spriteShape.thumbnailData = json.thumbnailData;
        spriteShape.obj.frameName = json.frameName;
        spriteShape.obj.spriteSheetId = json.spriteSheetId;
        spriteShape.obj.deserialize(json.obj);
        return [spriteShape, undefined];
    }
}
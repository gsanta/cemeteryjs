import { SpriteObj, SpriteObjJson } from "../../../../../core/models/objs/SpriteObj";
import { AbstractShape, ShapeJson } from "../../../../../core/models/views/AbstractShape";
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

    constructor() {
        super();
        this.renderer = new SpriteShapeRenderer();
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

    fromJson(json: SpriteShapeJson, registry: Registry) {
        super.fromJson(json, registry);
        this.thumbnailData = json.thumbnailData;
        this.obj.frameName = json.frameName;
        this.obj.spriteSheetId = json.spriteSheetId;
        this.obj.deserialize(json.obj);
    }
}
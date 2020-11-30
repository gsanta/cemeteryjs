import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";
import { Registry } from "../../../../core/Registry";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { SpriteObj, SpriteObjJson, SpriteObjType } from "../../../../core/models/objs/SpriteObj";
import { View, ViewFactory, ViewFactoryAdapter, ViewJson, ViewRenderer, ViewTag } from "../../../../core/models/views/View";
import { SpriteViewRenderer } from "./SpriteViewRenderer";

export const SpriteViewType = 'sprite-view';

export interface SpriteViewJson extends ViewJson {
    frameName: string;
    thumbnailData: string;
    spriteSheetId: string;
    obj: SpriteObjJson;
}

export class SpriteView extends View {
    viewType = SpriteViewType;

    color: string = colors.pastelGreen;
    thumbnailData: string;
    protected obj: SpriteObj;

    constructor() {
        super();
        this.renderer = new SpriteViewRenderer();
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

    clone(): SpriteView {
        throw new Error('not implemented')
    }

    toJson(): SpriteViewJson {
        return {
            ...super.toJson(),
            frameName: this.obj.frameName,
            thumbnailData: this.thumbnailData,
            spriteSheetId: this.obj.spriteSheetId,
            obj: this.obj.serialize()
        }
    }

    fromJson(json: SpriteViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.thumbnailData = json.thumbnailData;
        this.obj.frameName = json.frameName;
        this.obj.spriteSheetId = json.spriteSheetId;
        this.obj.deserialize(json.obj);
    }
}
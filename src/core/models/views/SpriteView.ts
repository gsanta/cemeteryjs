import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../Registry";
import { SpriteObj, SpriteObjJson } from "../objs/SpriteObj";
import { PathView } from "./PathView";
import { View, ViewFactory, ViewJson } from "./View";

export const SpriteViewType = 'sprite-view';

export interface SpriteViewJson extends ViewJson {
    frameName: string;
    thumbnailData: string;
    spriteSheetId: string;
    obj: SpriteObjJson;
}

export class SpriteViewFactory implements ViewFactory {
    viewType = SpriteViewType;
    newInstance() { return new SpriteView(); }
}

export class SpriteView extends View {
    viewType = SpriteViewType;

    thumbnailData: string;
    protected obj: SpriteObj;

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
        this.obj.dispose();
    }

    toJson(): SpriteViewJson {
        return {
            ...super.toJson(),
            frameName: this.obj.frameName,
            thumbnailData: this.thumbnailData,
            spriteSheetId: this.obj.spriteSheetId,
            obj: this.obj.toJson()
        }
    }

    fromJson(json: SpriteViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.thumbnailData = json.thumbnailData;
        this.obj.frameName = json.frameName;
        this.obj.spriteSheetId = json.spriteSheetId;
        this.obj.fromJson(json.obj);
    }
}
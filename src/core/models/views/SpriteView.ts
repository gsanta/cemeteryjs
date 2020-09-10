import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { SpriteObj, SpriteObjJson } from "../game_objects/SpriteObj";
import { View, ViewJson } from "./View";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Registry } from "../../Registry";
export const SpriteViewType = 'SpriteView';

export interface SpriteViewJson extends ViewJson {
    frameName: string;
    thumbnailData: string;
    spriteSheetId: string;
    obj: SpriteObjJson;
}

export class SpriteView extends View {
    viewType = SpriteViewType;

    thumbnailData: string;

    constructor(config?: {dimensions?: Rectangle}) {
        super();
        this.dimensions = config && config.dimensions;
        this.obj = new SpriteObj();
    }

    obj: SpriteObj;

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        this.obj.move(point.div(10).negateY());
    }

    delete() {
        this.obj.delete();
        return [this];
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
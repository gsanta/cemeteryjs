import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { SpriteObj } from "../game_objects/SpriteObj";
import { View, ViewJson } from "./View";
import { Point } from "../../../utils/geometry/shapes/Point";
export const SpriteViewType = 'SpriteView';

export interface SpriteViewJson extends ViewJson {
    frameName: string;
    thumbnailData: string;
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

    toJson(): SpriteViewJson {
        return {
            ...super.toJson(),
            frameName: this.obj.frameName,
            thumbnailData: this.thumbnailData,
        }
    }

    fromJson(json: SpriteViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.thumbnailData = json.thumbnailData;
        this.obj.frameName = json.frameName;
    }
}
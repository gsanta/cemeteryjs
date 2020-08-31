import { Sprite, Vector3 } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { IGameObj } from "./IGameObj";

export interface SpriteObjJson {
    frameName: string;
    x: number;
    y: number;
    id: string;
}

 export class SpriteObj implements IGameObj {
    id: string;

    sprite: Sprite;
    startPos: Point;

    spriteAssetId: string;
    frameName: string;
    jsonFileName: string;

    toJson(): SpriteObjJson {
        return {
            frameName: this.frameName,
            x: this.sprite.position.x,
            y: this.sprite.position.z,
            id: this.id
        }
    }

    fromJson(json: SpriteObjJson) {
        this.frameName = json.frameName;
        this.sprite.position = new Vector3(json.x, this.sprite.position.y, json.y);
    }
}

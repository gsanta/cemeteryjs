import { Sprite, Vector3 } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { IGameObj } from "./IGameObj";
import { ISpriteAdapter } from "../../adapters/ISpriteAdapter";

export interface SpriteObjJson {
    frameName: string;
    x: number;
    y: number;
    id: string;
}

 export class SpriteObj implements IGameObj {
    id: string;

    spriteAdapter: ISpriteAdapter;

    sprite: Sprite;
    startPos: Point;
    startScale: Point;

    spriteSheetId: string;
    frameName: string;

    toJson(): SpriteObjJson {
        return {
            frameName: this.frameName,
            x: this.sprite.position.x,
            y: this.sprite.position.z,
            id: this.id
        }
    }

    move(point: Point) {
        this.startPos.add(point);

        if (this.spriteAdapter) {
            this.spriteAdapter.setPosition(this, this.spriteAdapter.getPosition(this).add(point));
        }
    }

    fromJson(json: SpriteObjJson) {
        this.frameName = json.frameName;
        this.sprite.position = new Vector3(json.x, this.sprite.position.y, json.y);
    }
}

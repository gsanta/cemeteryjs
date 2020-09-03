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
    private startScale: Point = new Point(1, 1);

    spriteSheetId: string;
    frameName: string;

    move(point: Point) {
        this.startPos.add(point);

        if (this.spriteAdapter) {
            this.spriteAdapter.setPosition(this, this.spriteAdapter.getPosition(this).add(point));
        }
    }

    setScale(scale: Point) {
        this.startScale = scale;

        this.spriteAdapter && this.spriteAdapter.setScale(this, scale);
    }

    getScale(): Point {
        return this.startScale;
    }

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

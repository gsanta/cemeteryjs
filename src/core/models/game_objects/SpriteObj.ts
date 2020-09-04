import { Sprite } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { ISpriteAdapter } from "../../adapters/ISpriteAdapter";
import { IGameObj } from "./IGameObj";

export interface SpriteObjJson {
    frameName: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
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

    delete() {
        this.spriteAdapter && this.spriteAdapter.deleteInstance(this);
    }

    move(point: Point) {
        this.startPos.add(point);

        if (this.spriteAdapter) {
            this.spriteAdapter.setPosition(this, this.spriteAdapter.getPosition(this).add(point));
        }
    }

    setPosition(pos: Point) {
        this.startPos = pos;

        this.spriteAdapter && this.spriteAdapter.setScale(this, pos);

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
            id: this.id,
            frameName: this.frameName,
            x: this.startPos && this.startPos.x,
            y: this.startPos && this.startPos.y,
            scaleX: this.getScale().x,
            scaleY: this.getScale().y
        }
    }

    fromJson(json: SpriteObjJson) {
        this.frameName = json.frameName;
        if (json.x !== undefined && json.y !== undefined) {
            this.setPosition(new Point(json.x, json.y));
        }
        this.setScale(new Point(json.scaleX, json.scaleY));
    }
}

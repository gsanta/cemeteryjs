import { Sprite } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ISpriteAdapter } from "../../engine/ISpriteAdapter";
import { Registry } from "../../Registry";
import { IObj, ObjFactory, ObjJson } from "./IObj";

export const LightObjType = 'light-obj';

export interface SpriteObjJson extends ObjJson {
    frameName: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    id: string;
    spriteSheetId: string;
}

export class LigthObjFactory implements ObjFactory {
    private registry: Registry;

    objType = LightObjType;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    newInstance() {
        const obj = new LightObj();
        return obj;
    }
}

export class LightObj implements IObj {
    id: string;
    objType = LightObjType;


    color: string;
    sprite: Sprite;
    startPos: Point;
    startScale: Point = new Point(1, 1);

    spriteSheetId: string;
    frameName: string;

    move(point: Point) {
        this.startPos.add(point);
    }

    setPosition(pos: Point) {
        this.startPos = pos;
    }

    getPosition(): Point_3 {
        return undefined;
    }

    setScale(scale: Point) {
    }

    getScale(): Point {
        return undefined;
    }

    dispose() {
    }

    serialize(): SpriteObjJson {
        return {
            id: this.id,
            objType: this.objType,
            frameName: this.frameName,
            x: this.startPos && this.startPos.x,
            y: this.startPos && this.startPos.y,
            scaleX: this.getScale().x,
            scaleY: this.getScale().y,
            spriteSheetId: this.spriteSheetId
        }
    }

    deserialize(json: SpriteObjJson) {
        this.frameName = json.frameName;
        if (json.x !== undefined && json.y !== undefined) {
            this.setPosition(new Point(json.x, json.y));
        }
        this.setScale(new Point(json.scaleX, json.scaleY));
        this.spriteSheetId = json.spriteSheetId;
    }
}
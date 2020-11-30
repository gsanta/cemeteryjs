import { Sprite } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ISpriteAdapter } from "../../engine/ISpriteAdapter";
import { Registry } from "../../Registry";
import { IObj, ObjFactory, ObjFactoryAdapter, ObjJson } from "./IObj";

export const SpriteObjType = 'sprite-obj';

export interface SpriteObjJson extends ObjJson {
    frameName: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    id: string;
    spriteSheetId: string;
}

export class SpriteObjFactory extends ObjFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super(SpriteObjType);
        this.registry = registry;
    }

    newInstance() {
        const obj = new SpriteObj();
        obj.spriteAdapter = this.registry.engine.sprites;
        return obj;
    }
}

export class SpriteObj implements IObj {
    id: string;
    objType = SpriteObjType;

    spriteAdapter: ISpriteAdapter;

    color: string;
    startPos: Point;
    startScale: Point = new Point(1, 1);

    spriteSheetId: string;
    frameName: string;

    move(point: Point) {
        this.startPos.add(point);

        if (this.spriteAdapter) {
            this.spriteAdapter.setPosition(this, this.spriteAdapter.getPosition(this).add(point));
        }
    }

    setPosition(pos: Point) {
        this.startPos = pos;

        this.spriteAdapter && this.spriteAdapter.setPosition(this, pos);
    }

    getPosition(): Point_3 {
        let pos = this.spriteAdapter && this.spriteAdapter.getPosition(this);

        if (!pos) {
            pos = this.startPos;
        }

        return <Point_3> pos;
    }

    setScale(scale: Point) {
        this.startScale = scale;

        this.spriteAdapter && this.spriteAdapter.setScale(this, scale);
    }

    getScale(): Point {
        let scale = this.spriteAdapter && this.spriteAdapter.getScale(this);
        
        return scale || this.startScale;
    }

    getRotation(): number {
        throw new Error('unimplemented');
    }

    dispose() {
        this.spriteAdapter && this.spriteAdapter.deleteInstance(this);
    }

    clone(): SpriteObj {
        throw new Error('not implemented');
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
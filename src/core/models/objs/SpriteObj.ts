import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ISpriteAdapter } from "../../engine/ISpriteAdapter";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { IObj, ObjJson } from "./IObj";

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

export class SpriteObj implements IObj {
    objType = SpriteObjType;
    id: string;
    name: string;

    spriteAdapter: ISpriteAdapter;

    color: string;
    startPos: Point;
    startScale: Point = new Point(1, 1);

    spriteSheetId: string;
    frameName: string;
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
        this.spriteAdapter = this.canvas.engine.sprites;
    }

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

    getRotation(): Point_3 {
        throw new Error('unimplemented');
    }

    
    /**
     * Set the visibility of a sprite
     * @param visibility number between 0 and 1, 0 means invisible, 1 means fully visible
     */
    setVisibility(visibility: number): void {
        throw new Error('not implemented')
    }

    /**
     * Get the visibility of a sprite
     * @returns number between 0 and 1, 0 means invisible, 1 means fully visible
     */    
    getVisibility(): number {
        throw new Error('not implemented')
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
            name: this.name,
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
        this.name = json.name;
        if (json.x !== undefined && json.y !== undefined) {
            this.setPosition(new Point(json.x, json.y));
        }
        this.setScale(new Point(json.scaleX, json.scaleY));
        this.spriteSheetId = json.spriteSheetId;
        return undefined;
    }
}
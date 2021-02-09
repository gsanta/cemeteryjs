import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ISpriteAdapter } from "../../engine/ISpriteAdapter";
import { colors } from "../../ui_components/react/styles";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { ObjEventType, ObjObservable } from "../ObjObservable";
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
    observable: ObjObservable;

    color: string = colors.darkorchid;

    spriteSheetId: string;
    frameName: string;
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
        this.spriteAdapter = this.canvas.engine.sprites;
        this.observable = new ObjObservable();

        this.canvas.data.items.addItem(this);
    }

    move(point: Point) {
        this.spriteAdapter.setPosition(this, this.spriteAdapter.getPosition(this).add(point));
        this.observable.emit({ obj: this, eventType: ObjEventType.PositionChanged });
    }

    setPosition(pos: Point) {
        this.spriteAdapter && this.spriteAdapter.setPosition(this, pos);
        this.observable.emit({ obj: this, eventType: ObjEventType.PositionChanged });
    }

    getPosition(): Point_3 {
        let pos = this.spriteAdapter.getPosition(this);

        return <Point_3> pos;
    }

    setScale(scale: Point) {
        this.spriteAdapter.setScale(this, scale);
    }

    getScale(): Point {
        return this.spriteAdapter.getScale(this);
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
        const position = this.getPosition();
        return {
            id: this.id,
            name: this.name,
            objType: this.objType,
            frameName: this.frameName,
            x: position.x,
            y: position.y,
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
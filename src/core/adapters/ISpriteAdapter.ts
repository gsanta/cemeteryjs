import { Point } from "../../utils/geometry/shapes/Point";
import { SpriteObj } from "../models/game_objects/SpriteObj";

export interface ISpriteAdapter {
    setPosition(spriteObj: SpriteObj, pos: Point): void;
    getPosition(spriteObj: SpriteObj): Point;
    setScale(spriteObj: SpriteObj, scale: Point): void;
    createInstance(spriteObj: SpriteObj): void;
    updateInstance(spriteObj: SpriteObj): void;
}
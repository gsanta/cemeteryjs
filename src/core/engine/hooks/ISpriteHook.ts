import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { SpriteObj } from "../../models/objs/SpriteObj";


export interface ISpriteHook {
    setPositionHook(spriteObj: SpriteObj, pos: Point_3): void;
}
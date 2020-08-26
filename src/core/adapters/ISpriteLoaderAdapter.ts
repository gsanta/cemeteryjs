import { SpriteObj } from "../models/game_objects/SpriteObj";

export interface ISpriteLoaderAdapter {
    load(spriteObj: SpriteObj);
}
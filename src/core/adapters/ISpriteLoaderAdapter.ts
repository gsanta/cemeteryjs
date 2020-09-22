import { SpriteObj } from "../models/objs/SpriteObj";
import { SpriteSheetObj } from "../models/objs/SpriteSheetObj";

export interface ISpriteLoaderAdapter {

    loadSpriteSheet(spriteSheetObj: SpriteSheetObj);
}
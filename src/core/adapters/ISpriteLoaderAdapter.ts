import { SpriteObj } from "../models/game_objects/SpriteObj";
import { SpriteSheetObj } from "../models/game_objects/SpriteSheetObj";

export interface ISpriteLoaderAdapter {

    loadSpriteSheet(spriteSheetObj: SpriteSheetObj);
}
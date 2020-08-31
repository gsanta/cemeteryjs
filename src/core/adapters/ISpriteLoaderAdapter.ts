import { SpriteObj } from "../models/game_objects/SpriteObj";
import { AssetObj } from "../models/game_objects/AssetObj";

export interface ISpriteLoaderAdapter {

    loadSpriteSheet(assetObj: AssetObj);
    load(spriteObj: SpriteObj);
}
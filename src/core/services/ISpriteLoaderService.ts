import { SpriteObj } from "../models/game_objects/SpriteObj";

export interface ISpriteLoaderService {
    load(spriteObj: SpriteObj);
}
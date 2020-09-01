import { AbstractObjStore } from "./AbstractObjStore";
import { IGameObj } from "../models/game_objects/IGameObj";
import { SpriteSheetObj } from "../models/game_objects/SpriteSheetObj";


export class SpriteSheetObjStore extends AbstractObjStore<SpriteSheetObj> {
    protected objs: SpriteSheetObj[] = [];


    protected createPrefix(obj: IGameObj): string {
        return 'spritesheet';
    }
}
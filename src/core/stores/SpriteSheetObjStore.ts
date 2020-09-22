import { AbstractObjStore } from "./AbstractObjStore";
import { IGameObj } from "../models/objs/IGameObj";
import { SpriteSheetObj } from "../models/objs/SpriteSheetObj";


export class SpriteSheetObjStore extends AbstractObjStore<SpriteSheetObj> {
    protected objs: SpriteSheetObj[] = [];


    protected createPrefix(obj: IGameObj): string {
        return 'spritesheet';
    }
}
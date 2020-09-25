import { AbstractObjStore } from "./AbstractObjStore";
import { IObj } from "../models/objs/IObj";
import { SpriteSheetObj } from "../models/objs/SpriteSheetObj";


export class SpriteSheetObjStore extends AbstractObjStore<SpriteSheetObj> {
    protected objs: SpriteSheetObj[] = [];



}
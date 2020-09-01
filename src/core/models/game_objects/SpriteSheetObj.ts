import { IGameObj } from "./IGameObj";


export class SpriteSheetObj implements IGameObj {
    id: string;

    spriteAssetId: string;
    jsonAssetId: string;
}
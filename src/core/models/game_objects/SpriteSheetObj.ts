import { IGameObj, ObjJson } from "./IGameObj";

export interface SpriteSheetObjJson extends ObjJson {
    spriteAssetId: string;
    jsonAssetId: string;
}

export const SpriteSheetObjType = 'sprite-sheet-obj';
export class SpriteSheetObj implements IGameObj {
    id: string;

    spriteAssetId: string;
    jsonAssetId: string;

    dispose() {}

    toJson(): SpriteSheetObjJson {
        return {
            id: this.id,
            spriteAssetId: this.spriteAssetId,
            jsonAssetId: this.jsonAssetId
        }
    }

    fromJson(json: SpriteSheetObjJson): void {
        this.id = json.id;
        this.spriteAssetId = json.spriteAssetId;
        this.jsonAssetId = json.jsonAssetId;
    }
}
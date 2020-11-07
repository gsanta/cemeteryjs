import { IObj, ObjFactory, ObjJson } from "./IObj";

export const SpriteSheetObjType = 'sprite-sheet-obj';

export interface SpriteSheetObjJson extends ObjJson {
    spriteAssetId: string;
    jsonAssetId: string;
}

export class SpriteSheetObjFactory implements ObjFactory {
    objType = SpriteSheetObjType;
    newInstance() {
        return new SpriteSheetObj();
    }
}

export class SpriteSheetObj implements IObj {
    id: string;
    objType = SpriteSheetObjType;

    spriteAssetId: string;
    jsonAssetId: string;

    dispose() {}

    serialize(): SpriteSheetObjJson {
        return {
            id: this.id,
            objType: this.objType,
            spriteAssetId: this.spriteAssetId,
            jsonAssetId: this.jsonAssetId
        }
    }

    deserialize(json: SpriteSheetObjJson): void {
        this.id = json.id;
        this.spriteAssetId = json.spriteAssetId;
        this.jsonAssetId = json.jsonAssetId;
    }
}
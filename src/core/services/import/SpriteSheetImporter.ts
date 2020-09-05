import { AbstractPluginImporter } from "./AbstractPluginImporter";
import { IDataImporter } from "./IDataImporter";
import { AppJson } from "../export/ExportService";
import { SpriteSheetObjType, SpriteSheetObj, SpriteSheetObjJson } from "../../models/game_objects/SpriteSheetObj";
import { Registry } from "../../Registry";

export class SpriteSheetImporter implements IDataImporter {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    async import(json: AppJson): Promise<void> {
        const spriteSheetJsons = (json.objs || []).find(obj => obj.objType === SpriteSheetObjType)?.objs || [];

        spriteSheetJsons.forEach(spriteSheetJson => {
            const spriteSheetObj: SpriteSheetObj = new SpriteSheetObj();
            spriteSheetObj.fromJson(<SpriteSheetObjJson> spriteSheetJson);
    
            this.registry.stores.spriteSheetObjStore.addObj(spriteSheetObj);
            this.registry.engine.spriteLoader.loadSpriteSheet(spriteSheetObj);
        });
    }
}
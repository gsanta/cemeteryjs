import { IDataExporter } from "./IDataExporter";
import { Registry } from "../../Registry";
import { AppJson } from "./ExportService";
import { ObjJson } from "../../models/objs/IObj";
import { SpriteSheetObjType } from "../../models/objs/SpriteSheetObj";

export class SpriteSheetExporter implements IDataExporter {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(json: Partial<AppJson>): void {
        if (this.registry.stores.objStore.size() === 0) { return; }

        if (!json.objs) {
            json.objs = [];
        }

        const objs: {objType: string, objs: ObjJson[] } = {
            objType: SpriteSheetObjType,
            objs: []
        };

        json.objs.push(objs);

        this.registry.stores.objStore.getAll().forEach(spriteSheetObj => {
            objs.objs.push(spriteSheetObj.toJson());
        });
    }
}
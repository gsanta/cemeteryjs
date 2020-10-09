import { AssetObjType } from "../../models/objs/AssetObj";
import { ObjJson } from "../../models/objs/IObj";
import { Registry } from "../../Registry";
import { AppJson } from "./ExportService";
import { IDataExporter } from "./IDataExporter";

export class AssetObjExporter implements IDataExporter {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(json: Partial<AppJson>): void {
        if (this.registry.stores.assetStore.size() === 0) { return; }

        if (!json.objs) {
            json.objs = [];
        }

        const objs: {objType: string, objs: ObjJson[] } = {
            objType: AssetObjType,
            objs: []
        };

        json.objs.push(objs);

        this.registry.stores.assetStore.getAll().forEach(assetObj => {
            objs.objs.push(assetObj.serialize());
        });
    }
}
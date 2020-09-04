
import { AssetObj, AssetObjJson, AssetObjType } from "../../models/game_objects/AssetObj";
import { Registry } from "../../Registry";
import { AppJson } from "../export/ExportService";
import { IDataImporter } from "./IDataImporter";

export class AssetObjImporter implements IDataImporter {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    async import(json: AppJson): Promise<void> {
        const assetJsons = json.objs.find(obj => obj.objType === AssetObjType)?.objs || [];

        const promises: Promise<void>[] = [];

        assetJsons.forEach(assetJson => {
            const assetObj: AssetObj = new AssetObj();
            assetObj.fromJson(<AssetObjJson> assetJson);
    
            this.registry.stores.assetStore.addObj(assetObj);

            promises.push(this.registry.services.localStore.loadAsset(assetObj));
        });

        await promises;
    }
}
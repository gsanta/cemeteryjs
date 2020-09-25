import { View } from '../../models/views/View';
import { Registry } from '../../Registry';
import { AppJson } from '../export/ExportService';
import { IDataImporter } from './IDataImporter';
import { SpriteSheetImporter } from './SpriteSheetImporter';
import { AssetObjImporter } from './AssetObjImporter';

export class ImportService {
    serviceName = 'import-service';
    private registry: Registry;
    private importers: IDataImporter[] = [];

    constructor(registry: Registry) {
        this.registry = registry;

        this.importers.push(new AssetObjImporter(registry));
        this.importers.push(new SpriteSheetImporter(registry));
    }

    async import(file: string): Promise<void> {
        const json = <AppJson> JSON.parse(file);

        this.importObjs(json);

        try {
            for (let i = 0; i < this.importers.length; i++) {
                await this.importers[i].import(json);
            }
        } catch (e) {
            console.error(e);
        }

        const promises: Promise<void>[] = [];

        const plugins = this.registry.plugins.getAll().filter(plugin => plugin.importer);
        
        try {
            for (let i = 0; i < plugins.length; i++) {
                await plugins[i].importer.import(json);
            }
        } catch (e) {
            console.error(e);
        }

        this.registry.services.render.reRenderAll();
    }

    private importObjs(json: AppJson) {
        json.objs.forEach(objType => {
            if (this.registry.services.objService.isRegistered(objType.objType)) {
                objType.objs.forEach(obj => {
                    const objInstance = this.registry.services.objService.createObj(objType.objType);
                    objInstance.fromJson(obj, this.registry);
                    this.registry.stores.objStore.addObj(objInstance);
                });
            }
        });
    }

    private importViews() {
        
    }
}
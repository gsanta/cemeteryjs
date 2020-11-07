import { Registry } from '../../Registry';
import { AppJson } from '../export/ExportService';
import { AssetObjImporter } from './AssetObjImporter';
import { IDataImporter } from './IDataImporter';

export class ImportService {
    private registry: Registry;
    private importers: IDataImporter[] = [];

    constructor(registry: Registry) {
        this.registry = registry;

        this.importers.push(new AssetObjImporter(registry));
    }

    async import(file: string): Promise<void> {
        const json = <AppJson> JSON.parse(file);

        try {
            for (let i = 0; i < this.importers.length; i++) {
                await this.importers[i].import(json);
            }
        } catch (e) {
            console.error(e);
        }

        this.importObjs(json);
        this.importViews(json);

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
        this.registry.stores.objStore.importFrom(json);
    }

    private importViews(json: AppJson) {
        this.registry.data.view.node.importFrom(json);
        this.registry.data.view.scene.importFrom(json);
    }
}
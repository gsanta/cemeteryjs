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

        try {
            for (let i = 0; i < this.importers.length; i++) {
                await this.importers[i].import(json);
            }
        } catch (e) {
            console.error(e);
        }

        const viewMap: Map<string, View> = new Map();

        const promises: Promise<void>[] = [];

        this.registry.plugins.getAll().forEach(plugin => {
            if (plugin.importer) {
                promises.push(plugin.importer.import(json, viewMap));
            }
        });

        await Promise.all(promises);
        this.registry.services.render.reRenderAll();
    }
}
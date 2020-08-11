import { Registry } from '../../Registry';
import { View } from '../../stores/views/View';
import { AppJson } from '../export/ExportService';
import { IPluginJson } from '../../../plugins/common/io/IPluginExporter';
import { AssetModel } from '../../stores/game_objects/AssetModel';

export class ImportService {
    serviceName = 'import-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(file: string): void {
        const json = <AppJson> JSON.parse(file);

        const viewMap: Map<string, View> = new Map();

        this.registry.plugins.getAll().forEach(plugin => plugin.importer?.import(json, viewMap));
    }
}
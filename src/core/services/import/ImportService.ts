import { Registry } from '../../Registry';
import { View } from '../../models/views/View';
import { AppJson } from '../export/ExportService';
import { IPluginJson } from '../../../plugins/common/io/IPluginExporter';
import { AssetModel } from '../../stores/AssetStore';

export class ImportService {
    serviceName = 'import-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(file: string): void {
        const json = <AppJson> JSON.parse(file);

        const viewMap: Map<string, View> = new Map();

        json.assets.forEach(assetJson => {
            const asset = new AssetModel();
            asset.fromJson(assetJson);
            const assetModel = this.registry.stores.assetStore.addAsset(asset);
        });
        
        this.registry.services.plugin.plugins.forEach(plugin => plugin.importer?.import(json, viewMap));

    }

    private findPluginImporter(pluginJson: IPluginJson) {
        return this.registry.services.plugin.plugins.find(plugin => plugin.getId() === pluginJson.pluginId);
    }
}
import { IPluginJson } from '../../../plugins/common/io/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetJson } from '../../stores/game_objects/AssetObject';

export interface ViewExporter {
    export(): string;
}

export interface AppJson {
    plugins: IPluginJson[];
    assets: AssetJson[];
}

export class ExportService {
    serviceName = 'export-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        const pluginJsons = this.registry.plugins.getAll().filter(plugin => plugin.exporter).map(plugin => plugin.exporter.export());
        // const assetJsons = this.registry.stores.assetStore.getAssets().map(asset => asset.toJson());

        return JSON.stringify({ plugins: pluginJsons});
    }
}
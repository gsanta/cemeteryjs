import { IPluginJson } from '../../../plugins/common/io/IPluginExporter';
import { Registry } from '../../Registry';

export interface ViewExporter {
    export(): string;
}

export interface AppJson {
    plugins: IPluginJson[];
}

export class ExportService {
    serviceName = 'export-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        const pluginJsons = this.registry.services.plugin.plugins.filter(plugin => plugin.exporter).map(plugin => plugin.exporter.export()); 

        return JSON.stringify({ plugins: pluginJsons});
    }
}
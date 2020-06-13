import { View } from "../../../core/models/views/View";
import { IPluginJson } from './IPluginExporter';
import { AppJson } from "../../../core/services/export/ExportService";
import { Registry } from "../../../core/Registry";
import { AbstractPlugin } from "../../../core/AbstractPlugin";

export interface PluginJson {
    _attributes: {
        "data-plugin-id": string;
    }

    g: ViewContainerJson<any>[];
}

export interface ViewContainerJson<T> {
    _attributes: {
        "data-view-type": string
    }

    g: T[];
}

export abstract class AbstractPluginImporter {

    protected registry: Registry;
    protected plugin: AbstractPlugin;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        this.registry = registry;
        this.plugin = plugin;
    }

    abstract import(json: AppJson, viewMap: Map<string, View>): void;

    protected getPluginJson(json: AppJson): IPluginJson {
        return json.plugins.find(plugin => plugin.pluginId === this.plugin.getId());
    }
} 
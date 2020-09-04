import { View } from "../../models/views/View";
import { IPluginJson } from '../../plugins/IPluginExporter';
import { AppJson } from "../export/ExportService";
import { Registry } from "../../Registry";
import { AbstractCanvasPlugin } from "../../plugins/AbstractCanvasPlugin";

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
    protected plugin: AbstractCanvasPlugin;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        this.registry = registry;
        this.plugin = plugin;
    }

    async abstract import(json: AppJson, viewMap: Map<string, View>): Promise<void>;

    protected getPluginJson(json: AppJson): IPluginJson {
        return json.plugins.find(plugin => plugin.pluginId === this.plugin.id);
    }
} 
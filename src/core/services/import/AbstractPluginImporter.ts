import { View } from "../../models/views/View";
import { IPluginJson } from '../../plugin/IPluginExporter';
import { AppJson } from "../export/ExportService";
import { Registry } from "../../Registry";
import { AbstractCanvasPanel } from "../../plugin/AbstractCanvasPanel";

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
    protected plugin: AbstractCanvasPanel;

    constructor(plugin: AbstractCanvasPanel, registry: Registry) {
        this.registry = registry;
        this.plugin = plugin;
    }

    async abstract import(json: AppJson): Promise<void>;

    protected getPluginJson(json: AppJson): IPluginJson {
        return json.plugins.find(plugin => plugin.pluginId === this.plugin.id);
    }
} 
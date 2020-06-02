import { View } from "../../../core/models/views/View";
import { IPluginJson } from './IPluginExporter';

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
    abstract import(plugin: IPluginJson, viewMap: Map<string, View>): void;
} 
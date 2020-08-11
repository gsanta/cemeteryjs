import { ViewJson } from "../../../core/stores/views/View";

export interface ViewGroupJson {
    viewType: string;
    views: ViewJson[];
}

export interface IPluginJson {
    pluginId: string;
    viewGroups: ViewGroupJson[];
}

export interface IPluginExporter {
    export(): IPluginJson;
} 
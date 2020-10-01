import { ViewJson } from "../models/views/View";

export interface ViewGroupJson {
    viewType: string;
    views: ViewJson[];
}

export interface IPluginJson {
    pluginId: string;
    viewGroups: ViewGroupJson[];
}
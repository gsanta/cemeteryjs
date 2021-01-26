import { ShapeJson } from "../models/shapes/AbstractShape";

export interface ViewGroupJson {
    viewType: string;
    views: ShapeJson[];
}

export interface IPluginJson {
    pluginId: string;
    viewGroups: ViewGroupJson[];
}
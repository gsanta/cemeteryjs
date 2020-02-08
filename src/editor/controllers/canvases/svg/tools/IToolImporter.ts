import { ViewType } from "../../../../../model/View";
import { ViewGroupJson } from "../../../../../world_generator/importers/svg/WorldMapJson";
import { ToolType } from "./Tool";

export interface IViewImporter {
    type: ViewType;
    import(group: ViewGroupJson): void;
} 

export function getImporterByType(toolType: ViewType, importers: IViewImporter[]) {
    return importers.find(tool => tool.type === toolType);
}
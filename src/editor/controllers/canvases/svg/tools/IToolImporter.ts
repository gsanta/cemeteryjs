import { IToolType } from "./IToolType";
import { RawWorldMapJson, ToolGroupJson } from "../../../../../world_generator/importers/svg/WorldMapJson";
import { ToolType } from "./Tool";

export interface IToolImporter extends IToolType {
    import(group: ToolGroupJson): void;
} 

export function getImporterByType(toolType: ToolType, importers: IToolImporter[]) {
    return importers.find(tool => tool.type === toolType);
}
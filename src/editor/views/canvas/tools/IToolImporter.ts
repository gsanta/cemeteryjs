import { ViewGroupJson } from "../../../services/import/ImportService";
import { CanvasItemType } from "../models/CanvasItem";

export interface IViewImporter {
    type: CanvasItemType;
    import(group: ViewGroupJson): void;
} 

export function getImporterByType(type: CanvasItemType, importers: IViewImporter[]) {
    return importers.find(tool => tool.type === type);
}
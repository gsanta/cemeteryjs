import { ConceptGroupJson } from "./ImportService";
import { CanvasItemType } from "../../views/canvas/models/CanvasItem";

export interface IConceptImporter {
    type: CanvasItemType;
    import(group: ConceptGroupJson): void;
} 

export function getImporterByType(type: CanvasItemType, importers: IConceptImporter[]) {
    return importers.find(tool => tool.type === type);
}
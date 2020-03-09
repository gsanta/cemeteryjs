import { ViewGroupJson } from "../../../services/import/ImportService";
import { ConceptType } from "../models/concepts/Concept";

export interface IViewImporter {
    type: ConceptType;
    import(group: ViewGroupJson): void;
} 

export function getImporterByType(toolType: ConceptType, importers: IViewImporter[]) {
    return importers.find(tool => tool.type === toolType);
}
import { ConceptGroupJson } from "./ImportService";
import { ConceptType } from "../../models/views/View";

export interface IConceptImporter {
    type: ConceptType;
    import(group: ConceptGroupJson): void;
} 

export function getImporterByType(type: ConceptType, importers: IConceptImporter[]) {
    return importers.find(importer => importer.type === type);
}
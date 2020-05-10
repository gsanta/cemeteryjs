import { ConceptGroupJson } from "./ImportService";
import { ConceptType } from "../../models/concepts/Concept";

export interface IConceptImporter {
    type: ConceptType;
    import(group: ConceptGroupJson): void;
} 

export function getImporterByType(type: ConceptType, importers: IConceptImporter[]) {
    return importers.find(importer => importer.type === type);
}
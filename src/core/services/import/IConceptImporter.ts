import { ConceptGroupJson } from "./ImportService";
import { Concept, ConceptType } from "../../../editor/models/concepts/Concept";

export interface IConceptImporter {
    type: ConceptType;
    import(group: ConceptGroupJson): void;
} 

export function getImporterByType(type: ConceptType, importers: IConceptImporter[]) {
    return importers.find(importer => importer.type === type);
}
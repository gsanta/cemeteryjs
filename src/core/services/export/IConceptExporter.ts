import { ConceptType } from "../../models/views/View";
import { VisualConcept } from "../../models/concepts/VisualConcept";

export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (item: VisualConcept) => void, unhover?: (item: VisualConcept) => void): JSX.Element;
    exportToFile(hover?: (item: VisualConcept) => void, unhover?: (item: VisualConcept) => void): JSX.Element;
} 
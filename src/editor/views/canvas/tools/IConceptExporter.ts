import { ConceptType, Concept, Subconcept } from "../models/concepts/Concept";


export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (view: Concept | Subconcept) => void, unhover?: (view: Concept | Subconcept) => void): JSX.Element;
} 
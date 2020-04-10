import { Concept, ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";

export interface IConceptConverter {
    viewType: ConceptType;
    convert(view: Concept): void;
}
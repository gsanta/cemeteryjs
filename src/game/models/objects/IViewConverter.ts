import { ConceptType, Concept } from "../../../editor/views/canvas/models/concepts/Concept";

export interface IViewConverter {
    viewType: ConceptType;
    convert(view: Concept): void;
}
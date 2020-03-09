import { ConceptType, Concept } from "../../../editor/windows/canvas/models/concepts/Concept";

export interface IViewConverter {
    viewType: ConceptType;
    convert(view: Concept): void;
}
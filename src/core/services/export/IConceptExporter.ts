import { ConceptType, Concept } from "../../../editor/models/concepts/Concept";
import { Feedback } from "../../../editor/models/feedbacks/Feedback";

export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void): JSX.Element;
} 
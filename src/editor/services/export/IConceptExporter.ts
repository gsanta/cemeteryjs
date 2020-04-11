import { ConceptType, Concept } from "../../views/canvas/models/concepts/Concept";
import { Feedback } from "../../views/canvas/models/feedbacks/Feedback";

export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void): JSX.Element;
} 
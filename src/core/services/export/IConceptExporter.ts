import { Feedback } from "../../models/feedbacks/Feedback";
import { ConceptType, Concept } from "../../models/concepts/Concept";

export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void): JSX.Element;
    exportToFile(hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void): JSX.Element;
} 
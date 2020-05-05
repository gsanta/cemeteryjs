import { MetaConcept } from "../meta/MetaConcept";
import { ConceptType } from "./Concept";

export class ActionConcept implements MetaConcept {
    type = ConceptType.ModelConcept;

    id: string;
    trigger: string;
    sourceConceptId: string;
    targetConceptId: string;
    result: string;
    resultData: string;
}
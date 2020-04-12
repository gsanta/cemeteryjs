import { MetaConcept } from "../meta/MetaConcept";
import { ConceptType } from "./Concept";


export class MaterialConcept implements MetaConcept {
    type = ConceptType.ModelConcept;
    id: string;

    modelPath: string;
    texturePath: string;
    thumbnailPath: string;
}
import { ConceptType } from "./views/View";


export class ModelConcept {
    type = ConceptType.ModelConcept;
    id: string;

    modelPath: string;
    texturePath: string;
    thumbnailPath: string;

    constructor(modelPath?: string) {
        this.modelPath = modelPath;
    }

    static getByModelPath(modelConcepts: ModelConcept[], modelPath: string): ModelConcept {
        return modelConcepts.find(concept => concept.modelPath === modelPath);
    }
}
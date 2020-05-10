import { ConceptType } from "../../../core/models/concepts/Concept";

export interface IGameObject {
    type: ConceptType;
    id: string;
    dispose(): void;
}
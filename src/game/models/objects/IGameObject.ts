import { ConceptType } from "../../../editor/models/concepts/Concept";

export interface IGameObject {
    type: ConceptType;
    id: string;
    dispose(): void;
}
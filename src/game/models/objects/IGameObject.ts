import { ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";

export interface IGameObject {
    type: ConceptType;
    id: string;
    dispose(): void;
}
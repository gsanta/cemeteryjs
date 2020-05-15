import { ConceptType } from "../../../core/models/views/View";

export interface IGameObject {
    type: ConceptType;
    id: string;
    dispose(): void;
}
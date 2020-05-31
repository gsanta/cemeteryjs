import { ConceptType } from "../views/View";

export interface IGameModel {
    type: ConceptType;
    id: string;
    dispose(): void;
}
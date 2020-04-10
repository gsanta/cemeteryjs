import { Concept, ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";
import { IGameObject } from "./IGameObject";

export interface IConceptConverter {
    viewType: ConceptType;
    convert(view: Concept): IGameObject;
}
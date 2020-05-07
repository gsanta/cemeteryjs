import { IGameObject } from "../../../game/models/objects/IGameObject";
import { ConceptType, Concept } from "../../../editor/models/concepts/Concept";

export interface IConceptConverter {
    viewType: ConceptType;
    convert(view: Concept): IGameObject;
}
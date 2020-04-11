import { Concept, ConceptType } from "../../views/canvas/models/concepts/Concept";
import { IGameObject } from "../../../game/models/objects/IGameObject";

export interface IConceptConverter {
    viewType: ConceptType;
    convert(view: Concept): IGameObject;
}
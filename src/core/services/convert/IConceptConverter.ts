import { IGameObject } from "../../../game/models/objects/IGameObject";
import { ConceptType, View } from "../../models/views/View";

export interface IConceptConverter {
    viewType: ConceptType;
    convert(view: View): IGameObject;
}
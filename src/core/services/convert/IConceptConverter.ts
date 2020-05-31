import { IGameModel } from "../../models/game_objects/IGameModel";
import { ConceptType, View } from "../../models/views/View";

export interface IConceptConverter {
    viewType: ConceptType;
    convert(view: View): IGameModel;
}
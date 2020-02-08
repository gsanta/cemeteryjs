import { ViewType, View } from "../../../model/View";
import { IGameObject } from "./IGameObject";

export interface IViewConverter {
    viewType: ViewType;
    convert(view: View): IGameObject;
}
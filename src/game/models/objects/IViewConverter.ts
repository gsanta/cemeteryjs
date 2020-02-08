import { ViewType, View } from "../../../common/views/View";
import { IGameObject } from "./IGameObject";

export interface IViewConverter {
    viewType: ViewType;
    convert(view: View): IGameObject;
}
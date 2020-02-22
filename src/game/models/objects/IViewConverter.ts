import { ViewType, View } from "../../../editor/canvas/models/views/View";
import { IGameObject } from "./IGameObject";

export interface IViewConverter {
    viewType: ViewType;
    convert(view: View): void;
}
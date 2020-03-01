import { ViewType, View } from "../../../editor/windows/canvas/models/views/View";

export interface IViewConverter {
    viewType: ViewType;
    convert(view: View): void;
}
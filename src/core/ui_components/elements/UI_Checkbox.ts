import { UI_ElementType } from "./UI_ElementType";
import { UI_InputElement } from "./UI_InputElement";

export class UI_Checkbox extends UI_InputElement {
    elementType = UI_ElementType.Checkbox;
    label: string;
}
import { UI_InputElement } from "./UI_InputElement";
import { UI_ElementType } from "./UI_ElementType";

export class UI_Button extends UI_InputElement {
    type = UI_ElementType.Button;
    icon?: string;
    label: string;
}
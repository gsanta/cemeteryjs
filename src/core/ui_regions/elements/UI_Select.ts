import { UI_InputElement } from "./UI_InputElement";
import { UI_ElementType } from "./UI_ElementType";

export class UI_Select extends UI_InputElement {
    elementType = UI_ElementType.Select;
    clearable: boolean = false;

    label: string;
    placeholder: string;
    values: string[];
}
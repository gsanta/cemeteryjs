import { UI_InputElement } from "./UI_InputElement";
import { UI_ElementType } from "./UI_ElementType";

export class UI_TextField extends UI_InputElement {
    elementType = UI_ElementType.TextField;
    label: string;
    type: 'text' | 'number'
}
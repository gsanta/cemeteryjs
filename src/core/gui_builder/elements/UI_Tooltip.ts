import { UI_ElementType } from "./UI_ElementType";
import { UI_InputElement } from "./UI_InputElement";

export class UI_Tooltip extends UI_InputElement {
    elementType = UI_ElementType.Tooltip;

    label: string;
    shortcut: string;
    parentId: string;
}
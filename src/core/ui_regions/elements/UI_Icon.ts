import { UI_ElementType } from "./UI_ElementType";
import { UI_InputElement } from './UI_InputElement';

export class UI_Icon extends UI_InputElement {
    elementType = UI_ElementType.Icon;

    iconName: string;
    width: string;
    height: string;
}
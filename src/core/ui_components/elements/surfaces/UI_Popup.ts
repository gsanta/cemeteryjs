import { UI_ElementType } from "../UI_ElementType";
import { UI_Layout } from '../UI_Layout';

export class UI_Popup extends UI_Layout {
    elementType = UI_ElementType.Popup;
    anchorElementKey: string;
}
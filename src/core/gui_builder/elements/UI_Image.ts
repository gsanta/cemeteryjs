import { UI_Element } from "./UI_Element";
import { UI_ElementType } from "./UI_ElementType";

export class UI_Image extends UI_Element {
    elementType = UI_ElementType.Image;
    text: string;

    width: string;
    height: string;
    src: string;
}
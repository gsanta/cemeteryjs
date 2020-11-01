import { UI_Element } from "../UI_Element";
import { UI_ElementType } from "../UI_ElementType";


export class UI_SvgText extends UI_Element {
    elementType = UI_ElementType.SvgText;
    text: string;
    x: number;
    y: number;
    color: string;
    anchor: 'start' | 'middle' | 'end';
    fontSize: string;
}
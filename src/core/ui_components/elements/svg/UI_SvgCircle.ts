import { UI_ElementType } from '../UI_ElementType';
import { UI_Element } from '../UI_Element';

export class UI_SvgCircle extends UI_Element {
    elementType = UI_ElementType.SvgCircle;
    transform: string;
    cx: number;
    cy: number;
    r: number;
    fillColor: string;
    strokeColor: string;
}
import { UI_ElementType } from '../UI_ElementType';
import { UI_Element } from '../UI_Element';

export class UI_SvgLine extends UI_Element {
    elementType = UI_ElementType.SvgLine;
    markerEnd: string;
    transform: string;
    width: number;
    stroke: string = 'black';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
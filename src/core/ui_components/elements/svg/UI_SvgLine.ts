import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';

export class UI_SvgLine extends UI_Element {
    elementType = UI_ElementType.SvgLine;
    markerEnd: string;
    markerMid: string;
    transform: string;
    width: number;
    stroke: string = 'black';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
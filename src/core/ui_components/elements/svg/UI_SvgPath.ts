import { UI_ElementType } from '../UI_ElementType';
import { UI_Element } from '../UI_Element';

export class UI_SvgPath extends UI_Element {
    elementType = UI_ElementType.SvgPath;
    d: string;
    fillColor: string;
    strokeColor: string;
    strokeOpacity: number;
    strokeWidth: number;
}
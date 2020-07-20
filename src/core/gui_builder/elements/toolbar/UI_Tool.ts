import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';

export class UI_Tool extends UI_Element {
    elementType = UI_ElementType.Tool;

    icon: string;
    tooltip: string;

    placement: 'left' | 'middle' | 'right';
}
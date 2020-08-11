import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';

export class UI_IconSeparator extends UI_Element {
    elementType = UI_ElementType.IconSeparator;

    placement: 'left' | 'middle' | 'right';
}
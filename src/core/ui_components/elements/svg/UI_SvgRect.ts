import { UI_ElementType } from '../UI_ElementType';
import { UI_Element } from '../UI_Element';

export class UI_SvgRect extends UI_Element {
    elementType = UI_ElementType.SvgRect;

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop}`;
    }

    transform: string;
    width: number;
    height: number;
    x: number;
    y: number;
    strokeColor: string;
    fillColor: string;
}
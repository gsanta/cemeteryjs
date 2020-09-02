import { UI_ElementType } from '../UI_ElementType';
import { UI_Element } from '../UI_Element';

export class UI_SvgLine extends UI_Element {
    elementType = UI_ElementType.SvgLine;

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop}`;
    }

    transform: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
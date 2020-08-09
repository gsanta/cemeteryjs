import { UI_ElementType } from '../UI_ElementType';
import { UI_Element } from '../UI_Element';
import { AbstractController } from '../../../controllers/AbstractController';

export class UI_SvgCircle extends UI_Element {
    elementType = UI_ElementType.SvgCircle;

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop}`;
    }

    transform: string;
    cx: number;
    cy: number;
    r: number;
    fillColor: string;
}
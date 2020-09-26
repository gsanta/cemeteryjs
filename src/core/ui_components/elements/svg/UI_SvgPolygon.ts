import { UI_Element } from "../UI_Element";
import { UI_ElementType } from "../UI_ElementType";


export class UI_SvgPolygon extends UI_Element {
    elementType = UI_ElementType.SvgPolygon;

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop}`;
    }

    points: string;
}
import { UI_Element } from "../UI_Element";
import { UI_ElementType } from "../UI_ElementType";


export class UI_SvgPolygon extends UI_Element {
    elementType = UI_ElementType.SvgPolygon;
    points: string;
}
import { UI_ElementType } from "../UI_ElementType";
import { UI_Element } from "../UI_Element";
import { UI_DefaultContainer } from '../UI_DefaultContainer';

export class UI_SvgForeignObject extends UI_DefaultContainer {
    elementType = UI_ElementType.SvgForeignObject;
    width: number;
    height: number;
    x: number = 0;
    y: number = 0;
}
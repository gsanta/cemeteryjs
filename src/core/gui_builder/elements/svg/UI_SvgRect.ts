import { UI_SvgContainer } from '../UI_SvgContainer';
import { UI_ElementType } from '../UI_ElementType';

export class UI_SvgRect extends UI_SvgContainer {
    elementType = UI_ElementType.SvgRect;

    transform: string;
    width: number;
    height: number;
    strokeColor: string;
}

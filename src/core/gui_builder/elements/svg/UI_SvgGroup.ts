import { UI_SvgContainer } from '../UI_SvgContainer';
import { UI_ElementType } from '../UI_ElementType';


export class UI_SvgGroup extends UI_SvgContainer {
    elementType = UI_ElementType.SvgGroup;

    transform: string;
}

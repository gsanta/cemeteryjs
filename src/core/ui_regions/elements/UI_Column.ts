import { UI_DefaultContainer } from './UI_DefaultContainer';
import { UI_ElementType } from "./UI_ElementType";

export class UI_Column extends UI_DefaultContainer {
    elementType = UI_ElementType.Column;
    hAlign: 'start' | 'center';
    vAlign: 'space-between' | 'space-around';
    height: string;
}

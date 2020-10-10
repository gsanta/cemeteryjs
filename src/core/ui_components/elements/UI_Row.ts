import { UI_DefaultContainer } from './UI_DefaultContainer';
import { UI_ElementType } from "./UI_ElementType";

export class UI_Row extends UI_DefaultContainer {
    elementType = UI_ElementType.Row;
    vAlign: 'start' | 'center';
    hAlign: 'space-between' | 'space-around';
    direction: 'left-to-right' | 'right-to-left' = 'left-to-right';
    height: string;
    padding: string;
    margin: string;
    separator?: 'top';
    backgroundColor: string;
}

import { UI_DefaultContainer } from './UI_DefaultContainer';
import { UI_ElementType } from "./UI_ElementType";

export class UI_Row extends UI_DefaultContainer {
    elementType = UI_ElementType.Row;
    vAlign: 'start' | 'center';
    hAlign: 'space-between' | 'space-around';
    height: string;
    padding: string;
    margin: string;
    backgroundColor: string;
}

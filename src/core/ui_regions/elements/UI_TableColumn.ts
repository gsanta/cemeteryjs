import { UI_DefaultContainer } from './UI_DefaultContainer';
import { UI_ElementType } from "./UI_ElementType";

export class UI_TableColumn extends UI_DefaultContainer {
    elementType = UI_ElementType.TableColumn;
    width: number;

    _derivedWidth: number;
}
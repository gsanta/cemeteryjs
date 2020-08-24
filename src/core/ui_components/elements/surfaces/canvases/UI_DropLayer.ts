import { UI_Element } from '../../UI_Element';
import { UI_ElementType } from '../../UI_ElementType';


export class UI_DropLayer extends UI_Element {
    elementType = UI_ElementType.DropLayer;
    acceptedDropIds: string[];

    isDragging = false;
}
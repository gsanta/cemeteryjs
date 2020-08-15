import { UI_Element } from './UI_Element';
import { UI_ElementType } from './UI_ElementType';

export class UI_ListItem extends UI_Element {
    elementType = UI_ElementType.ListItem;
    label: string;
    droppable: boolean;
    listItemId: string;

    dndStart() {
        this.plugin.getControllerById(this.controllerId).dndStart(this.prop, this.listItemId);
    }
}
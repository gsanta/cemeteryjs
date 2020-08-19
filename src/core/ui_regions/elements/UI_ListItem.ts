import { UI_Element } from './UI_Element';
import { UI_ElementType } from './UI_ElementType';
import { UI_Plugin } from '../../plugins/UI_Plugin';
import { AbstractCanvasPlugin } from '../../plugins/AbstractCanvasPlugin';
import { AbstractController } from '../../plugins/controllers/AbstractController';

export class UI_ListItem extends UI_Element {
    elementType = UI_ElementType.ListItem;
    label: string;
    droppable: boolean;
    listItemId: string;
    dropTargetPlugin: UI_Plugin;
    controller: AbstractController;

    dndStart() {
        (<AbstractCanvasPlugin> this.dropTargetPlugin).dropItem = this;

        this.controller && this.controller.dndStart(this.prop, this.listItemId);
    }
}
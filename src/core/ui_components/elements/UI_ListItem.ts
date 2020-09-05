import { UI_Element } from './UI_Element';
import { UI_ElementType } from './UI_ElementType';
import { UI_Plugin } from '../../plugins/UI_Plugin';
import { AbstractCanvasPlugin } from '../../plugins/AbstractCanvasPlugin';
import { AbstractController } from '../../plugins/controllers/AbstractController';
import { Point } from '../../../utils/geometry/shapes/Point';

export class UI_ListItem extends UI_Element {
    elementType = UI_ElementType.ListItem;
    label: string;
    droppable: boolean;
    listItemId: string;
    dropTargetPlugin: UI_Plugin;
    controller: AbstractController;

    dndStart() {
        (<AbstractCanvasPlugin> this.dropTargetPlugin).dropItem = this;
        // TODO find a better design, this is not ideal at all
        (<AbstractCanvasPlugin> this.dropTargetPlugin).mouse.dndStart();

        this.controller && this.controller.dndStart(this.prop, this, this.listItemId);
    }

    dndEnd() {
        (<AbstractCanvasPlugin> this.dropTargetPlugin).mouse.dndEnd();
    }
}
import { DragAndDropController } from '../../plugin/controller/FormController';
import { UI_Panel } from '../../plugin/UI_Panel';
import { UI_Element } from './UI_Element';
import { UI_ElementType } from './UI_ElementType';

export class UI_ListItem extends UI_Element<DragAndDropController> {
    elementType = UI_ElementType.ListItem;
    label: string;
    droppable: boolean;
    listItemId: string;
    dropTargetPlugin: UI_Panel;

    // dndStart(registry: Registry) {
    //     (<AbstractCanvasPanel> this.dropTargetPlugin).dropItem = this;
    //     // TODO find a better design, this is not ideal at all
    //     registry.ui.helper.hoveredPanel = <AbstractCanvasPanel> this.dropTargetPlugin;
    //     this.controller && this.controller.dndStart(this, this.listItemId);
    // }

    // dndEnd(registry: Registry) {
    //     this.controller && this.controller.dndEnd(this);
    // }
}
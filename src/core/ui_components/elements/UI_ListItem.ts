import { UI_Element } from './UI_Element';
import { UI_ElementType } from './UI_ElementType';
import { UI_Panel } from '../../plugin/UI_Panel';
import { AbstractCanvasPanel } from '../../plugin/AbstractCanvasPanel';
import { Registry } from '../../Registry';

export class UI_ListItem extends UI_Element {
    elementType = UI_ElementType.ListItem;
    label: string;
    droppable: boolean;
    listItemId: string;
    dropTargetPlugin: UI_Panel;

    dndStart(registry: Registry) {
        (<AbstractCanvasPanel> this.dropTargetPlugin).dropItem = this;
        // TODO find a better design, this is not ideal at all
        registry.plugins.setHoveredPlugin(<AbstractCanvasPanel> this.dropTargetPlugin);
        registry.plugins.getPropController(this.pluginId).dndStart(this, this.listItemId);
    }

    dndEnd(registry: Registry) {
        registry.plugins.getPropController(this.pluginId).dndEnd(this);
    }
}
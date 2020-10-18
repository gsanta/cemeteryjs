import { UI_Element } from '../UI_Element';
import { UI_Tool } from './UI_ToolIcon';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Factory } from '../../UI_Factory';
import { UI_ActionIcon } from './UI_ActionIcon';
import { UI_IconSeparator } from './UI_IconSeparator';
import { UI_Container } from '../UI_Container';

export class UI_ToolbarDropdown extends UI_Container {
    elementType = UI_ElementType.ToolbarDropdown;
    tools: (UI_Tool | UI_ActionIcon | UI_IconSeparator)[] = [];
    placement: 'left' | 'middle' | 'right';

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}`;
    }

    // tool(toolId: string): UI_Tool {
    //     return UI_Factory.tool(this, toolId);
    // }

    // actionIcon(config: { prop: string }): UI_ActionIcon {
    //     return UI_Factory.actionIcon(this, config);
    // }
}
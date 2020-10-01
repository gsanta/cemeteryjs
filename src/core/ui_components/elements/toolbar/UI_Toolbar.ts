import { UI_Element } from '../UI_Element';
import { UI_Tool } from './UI_ToolIcon';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Factory } from '../../UI_Factory';
import { UI_ActionIcon } from './UI_ActionIcon';
import { UI_IconSeparator } from './UI_IconSeparator';

export class UI_Toolbar extends UI_Element {
    elementType = UI_ElementType.Toolbar;
    tools: (UI_Tool | UI_ActionIcon | UI_IconSeparator)[] = [];

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}`;
    }

    tool(config: { controllerId?: string, key?: string, prop?: string }): UI_Tool {
        return UI_Factory.tool(this, config);
    }

    actionIcon(config: { controllerId?: string, prop: string }): UI_ActionIcon {
        return UI_Factory.actionIcon(this, config);
    }

    iconSeparator(): UI_IconSeparator {
        return UI_Factory.iconSeparator(this, {});
    }
}
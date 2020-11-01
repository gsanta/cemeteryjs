import { UI_Element, UI_ElementConfig } from '../UI_Element';
import { UI_Tool } from './UI_Tool';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Factory } from '../../UI_Factory';
import { UI_ActionIcon } from './UI_ActionIcon';
import { UI_IconSeparator } from './UI_IconSeparator';
import { UI_Container } from '../UI_Container';
import { UI_ToolDropdownHeader } from './UI_ToolDropdownHeader';

export class UI_ToolbarDropdown extends UI_Container {
    elementType = UI_ElementType.ToolbarDropdown;
    tools: (UI_Tool | UI_ActionIcon | UI_IconSeparator)[] = [];
    placement: 'left' | 'middle' | 'right';
    isOpen: boolean;
    _header: UI_ToolDropdownHeader;

    header(config: UI_ElementConfig): UI_ToolDropdownHeader {
        return UI_Factory.toolDropdownHeader(this, config);
    }

    tool(config: UI_ElementConfig): UI_Tool {
        return UI_Factory.tool(this, config);
    }

    // actionIcon(config: { prop: string }): UI_ActionIcon {
    //     return UI_Factory.actionIcon(this, config);
    // }
}
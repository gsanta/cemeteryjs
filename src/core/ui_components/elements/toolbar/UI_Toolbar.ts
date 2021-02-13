import { UI_ElementConfig } from '../UI_Element';
import { UI_Tool } from './UI_Tool';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Factory } from '../../UI_Factory';
import { UI_ActionIcon } from './UI_ActionIcon';
import { UI_IconSeparator } from './UI_IconSeparator';
import { UI_Container } from '../UI_Container';

export class UI_Toolbar extends UI_Container {
    elementType = UI_ElementType.Toolbar;
    activeToolRef: string;

    tool(config: UI_ElementConfig): UI_Tool {
        return UI_Factory.tool(this, config);
    }

    actionIcon(config: { key: string, uniqueId: string }): UI_ActionIcon {
        return UI_Factory.actionIcon(this, config);
    }

    iconSeparator(): UI_IconSeparator {
        return UI_Factory.iconSeparator(this, {});
    }

    toolbarDropdown(config: UI_ElementConfig) {
        return UI_Factory.toolbarDropdown(this, config);
    }

    select(config: UI_ElementConfig) {
        return UI_Factory.select(this, config);
    }
}
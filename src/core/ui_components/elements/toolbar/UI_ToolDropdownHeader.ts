import { UI_Element, UI_ElementConfig } from '../UI_Element';
import { UI_Tool } from './UI_Tool';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Factory } from '../../UI_Factory';
import { UI_Container } from '../UI_Container';
import { Registry } from '../../../Registry';

export class UI_ToolDropdownHeader extends UI_Container {
    elementType = UI_ElementType.ToolbarDropdownHeader;
    placement: 'left' | 'middle' | 'right';
    isOpen: boolean;
    _tool: UI_Tool;

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}`;
    }

    tool(config: UI_ElementConfig): UI_Tool {
        return UI_Factory.tool(this, config);
    }

    click(registry: Registry): void {
        registry.plugins.getPropController(this.pluginId).click(this);
    }
}
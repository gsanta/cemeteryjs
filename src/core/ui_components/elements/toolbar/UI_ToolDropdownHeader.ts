import { ListController } from '../../../plugin/controller/FormController';
import { UI_Factory } from '../../UI_Factory';
import { UI_Container } from '../UI_Container';
import { UI_ElementConfig } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Tool } from './UI_Tool';

export class UI_ToolDropdownHeader extends UI_Container<ListController> {
    elementType = UI_ElementType.ToolbarDropdownHeader;
    placement: 'left' | 'middle' | 'right';
    isOpen: boolean;
    _tool: UI_Tool;

    tool(config: UI_ElementConfig): UI_Tool {
        return UI_Factory.tool(this, config);
    }
}
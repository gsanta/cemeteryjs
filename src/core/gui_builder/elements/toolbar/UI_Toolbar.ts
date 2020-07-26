import { UI_Element } from '../UI_Element';
import { UI_Tool } from './UI_Tool';
import { UI_ElementType } from '../UI_ElementType';
import { Tool } from '../../../../plugins/common/tools/Tool';
import { UI_Factory } from '../../UI_Factory';

export class UI_Toolbar extends UI_Element {
    elementType = UI_ElementType.Toolbar;
    private tools: UI_Tool[] = [];

    get_UI_Tools(): UI_Tool[] {
        return this.tools;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}`;
    }

    tool(config: { toolId: string }): UI_Tool {
        return UI_Factory.tool(this, config);
    }
}
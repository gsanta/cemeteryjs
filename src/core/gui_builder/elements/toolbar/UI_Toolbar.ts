import { UI_Element } from '../UI_Element';
import { UI_Tool } from './UI_Tool';
import { UI_ElementType } from '../UI_ElementType';
import { Tool } from '../../../../plugins/common/tools/Tool';

export class UI_Toolbar extends UI_Element {
    elementType = UI_ElementType.Toolbar;
    private tools: UI_Tool[] = [];

    get_UI_Tools(): UI_Tool[] {
        return this.tools;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}`;
    }

    tool(tool: Tool): UI_Tool {
        const uiTool = new UI_Tool(tool);

        this.tools.push(uiTool);

        uiTool.generateId(this);
        return uiTool;

    }
}
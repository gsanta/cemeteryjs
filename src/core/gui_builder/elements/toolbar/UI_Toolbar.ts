import { UI_Element } from '../UI_Element';
import { UI_Tool } from './UI_Tool';
import { UI_ElementType } from '../UI_ElementType';


export class UI_Toolbar extends UI_Element {
    elementType = UI_ElementType.Toolbar;
    private tools: UI_Tool[] = [];

    get_UI_Tools(): UI_Tool[] {
        return this.tools;
    }

    tool(prop?: string): UI_Tool {
        const tool = new UI_Tool(this.controller);
        tool.prop = prop;

        this.tools.push(tool);

        return tool;

    }
}
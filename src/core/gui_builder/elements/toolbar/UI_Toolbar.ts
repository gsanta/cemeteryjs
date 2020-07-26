import { UI_Element } from '../UI_Element';
import { UI_Tool } from './UI_Tool';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Factory } from '../../UI_Factory';

export class UI_Toolbar extends UI_Element {
    elementType = UI_ElementType.Toolbar;
    tools: UI_Tool[] = [];

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}`;
    }

    tool(config: { controllerId: string }): UI_Tool {
        return UI_Factory.tool(this, config);
    }
}
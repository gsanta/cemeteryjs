import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Tooltip } from '../UI_Tooltip';
import { Tool } from '../../../../plugins/common/tools/Tool';

export class UI_Tool extends UI_Element {
    elementType = UI_ElementType.Tool;

    icon: string;
    _tooltip: UI_Tooltip;

    placement: 'left' | 'middle' | 'right';

    private tool: Tool;

    constructor(tool: Tool) {
        super(null);
        this.tool = tool;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}_tool-${this.tool.id}`;
    }

    tooltip() {
        this._tooltip = new UI_Tooltip(this.controller);

        this._tooltip.parentId = this.id;
        return this._tooltip;
    }

    getTooltip(): UI_Tooltip {
        return this._tooltip;
    }
}
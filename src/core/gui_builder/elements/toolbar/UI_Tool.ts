import { UI_Plugin } from '../../../UI_Plugin';
import { UI_Factory } from '../../UI_Factory';
import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Tooltip } from '../UI_Tooltip';

export class UI_Tool extends UI_Element {
    elementType = UI_ElementType.Tool;

    icon: string;
    _tooltip: UI_Tooltip;

    placement: 'left' | 'middle' | 'right';

    toolId: string;

    constructor(plugin: UI_Plugin) {
        super(plugin);
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}_tool-${this.toolId}`;
    }

    tooltip(): UI_Tooltip {
        return UI_Factory.tooltip(this);
    }

    getTooltip(): UI_Tooltip {
        return this._tooltip;
    }
}
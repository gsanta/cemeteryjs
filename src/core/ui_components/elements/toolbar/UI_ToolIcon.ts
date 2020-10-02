import { UI_Factory } from '../../UI_Factory';
import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Tooltip } from '../UI_Tooltip';

export class UI_Tool extends UI_Element {
    elementType = UI_ElementType.ToolIcon;

    icon: string;
    _tooltip: UI_Tooltip;

    placement: 'left' | 'middle' | 'right';

    toolId: string;
    color: string;

    constructor(pluginId: string) {
        super(pluginId);
    }

    tooltip(): UI_Tooltip {
        return UI_Factory.tooltip(this, { anchorId: this.id });
    }

    getTooltip(): UI_Tooltip {
        return this._tooltip;
    }
}
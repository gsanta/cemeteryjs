import { UI_Factory } from '../../UI_Factory';
import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Tooltip } from '../UI_Tooltip';
import { Registry } from '../../../Registry';

export class UI_Tool extends UI_Element {
    elementType = UI_ElementType.ToolIcon;

    icon: string;
    _tooltip: UI_Tooltip;
    isActive: boolean = false;

    placement: 'left' | 'middle' | 'right';

    color: string;

    tooltip(): UI_Tooltip {
        return UI_Factory.tooltip(this, { anchorId: this.uniqueId });
    }

    getTooltip(): UI_Tooltip {
        return this._tooltip;
    }

    click(registry: Registry): void {
        registry.plugins.getPlugin(this.pluginId).getController(this).click(this);
    }
}
import { UI_Element } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Tooltip } from '../UI_Tooltip';

export class UI_Tool extends UI_Element {
    elementType = UI_ElementType.Tool;

    icon: string;
    _tooltip: UI_Tooltip;

    placement: 'left' | 'middle' | 'right';

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop}`;
    }

    tooltip() {
        this._tooltip = new UI_Tooltip(this.controller);

        return this._tooltip;
    }

    getTooltip(): UI_Tooltip {
        return this._tooltip;
    }
}
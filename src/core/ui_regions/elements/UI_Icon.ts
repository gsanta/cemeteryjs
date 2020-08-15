import { UI_ElementType } from "./UI_ElementType";
import { UI_InputElement } from './UI_InputElement';
import { UI_Tooltip } from "./UI_Tooltip";
import { UI_Factory } from "../UI_Factory";

export class UI_Icon extends UI_InputElement {
    elementType = UI_ElementType.Icon;

    iconName: string;
    width: string;
    height: string;
    variant: 'success' | 'danger' | 'default';

    _tooltip: UI_Tooltip;

    placement: 'left' | 'middle' | 'right';

    toolId: string;

    tooltip(): UI_Tooltip {
        return UI_Factory.tooltip(this, { anchorId: this.id });
    }

    getTooltip(): UI_Tooltip {
        return this._tooltip;
    }
}
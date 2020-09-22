import { UI_ElementType } from "../UI_ElementType";
import { UI_Tooltip } from "../UI_Tooltip";
import { UI_Plugin } from "../../../plugin/UI_Plugin";
import { UI_Factory } from "../../UI_Factory";
import { UI_InputElement } from "../UI_InputElement";


export class UI_ActionIcon extends UI_InputElement {
    elementType = UI_ElementType.ActionIcon;

    icon: string;
    _tooltip: UI_Tooltip;

    placement: 'left' | 'middle' | 'right';

    constructor(plugin: UI_Plugin) {
        super(plugin);
    }

    tooltip(): UI_Tooltip {
        return UI_Factory.tooltip(this, { anchorId: this.id });
    }

    getTooltip(): UI_Tooltip {
        return this._tooltip;
    }
}
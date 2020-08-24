

import { UI_ElementType } from "../UI_ElementType";
import { UI_Layout } from '../UI_Layout';
import { UI_Region, UI_Plugin } from "../../../plugins/UI_Plugin";
import { GlobalControllerProps } from '../../../plugins/controllers/AbstractController';

export class UI_Dialog extends UI_Layout {
    elementType = UI_ElementType.Dialog;

    constructor(plugin: UI_Plugin) {
        super(plugin, UI_Region.Dialog);
    }

    width: string;
    height: string;
    title: string;

    close(): void {
        this.plugin.getControllerById(this.controllerId).click(GlobalControllerProps.CloseDialog, this);
    }
}
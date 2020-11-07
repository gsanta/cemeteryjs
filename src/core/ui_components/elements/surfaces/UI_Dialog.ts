

import { UI_ElementType } from "../UI_ElementType";
import { UI_Layout } from '../UI_Layout';
import { Registry } from "../../../Registry";
import { GlobalControllerProps } from "../../../plugin/controller/FormController";

export class UI_Dialog extends UI_Layout {
    elementType = UI_ElementType.Dialog;

    width: string;
    height: string;
    title: string;
    readonly prop = GlobalControllerProps.CloseDialog;

    close(registry: Registry): void {
        this.controller.click(this);
        this.canvasPanel.unmounted();
    }
}
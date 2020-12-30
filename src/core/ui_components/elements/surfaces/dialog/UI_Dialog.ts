

import { UI_ElementType } from "../../UI_ElementType";
import { UI_Layout } from '../../UI_Layout';
import { Registry } from "../../../../Registry";
import { GlobalControllerProps } from "../../../../plugin/controller/FormController";
import { UI_ElementConfig } from "../../UI_Element";
import { UI_Factory } from "../../../UI_Factory";
import { UI_DialogFooter } from "./UI_DialogFooter";
import { UI_Separator } from "../misc/UI_Separator";

export class UI_Dialog extends UI_Layout {
    elementType = UI_ElementType.Dialog;

    width: string;
    height: string;
    title: string;
    readonly prop = GlobalControllerProps.CloseDialog;

    footer(config: UI_ElementConfig): UI_DialogFooter {
        return UI_Factory.dialogFooter(this, config);
    }

    separator(config: UI_ElementConfig): UI_Separator {
        return UI_Factory.separator(this, config);
    }

    close(registry: Registry): void {
        this.controller.click(this);
    }
}
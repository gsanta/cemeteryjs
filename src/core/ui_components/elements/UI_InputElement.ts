import { PropController } from "../../plugin/controller/FormController";
import { Registry } from "../../Registry";
import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement<C extends PropController = PropController> extends UI_Element<C> {
    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';
    inputWidth: string;
    isDisabled: boolean = false;

    change(newVal: any, registry: Registry): void {
        this.controller && this.controller.change(newVal, this);
    }

    focus(registry: Registry): void {
        this.controller && this.controller.focus(this);
    }

    blur(registry: Registry): void {
        this.controller && this.controller.blur(this);
    }

    click(registry: Registry): void {
        this.controller && this.controller.click(this);
    }

    val(registry: Registry): any {
        return this.controller && this.controller.val(this);
    }

    values(registry: Registry): any[] {
        return this.controller && this.controller.values(this);
    }

    selectedValues(): any[] {
        return this.controller && this.controller.selectedValues(this) || [];
    }
}

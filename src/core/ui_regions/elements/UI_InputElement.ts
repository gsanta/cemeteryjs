import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {

    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';

    change(newVal: any): void {
        this.plugin.getControllerById(this.controllerId).change(this.prop, newVal);
    }

    focus(): void {
        this.plugin.getControllerById(this.controllerId).focus(this.prop);
    }

    blur(): void {
        this.plugin.getControllerById(this.controllerId).blur(this.prop);
    }

    click(): void {
        this.plugin.getControllerById(this.controllerId).click(this.prop, this)
    }

    val(): any {
        // TODO controllerId is deprecated
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        return controller.val(this.prop);
    }
}

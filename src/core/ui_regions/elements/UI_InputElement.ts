import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {

    listItemId: string;

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
        return this.plugin.getControllerById(this.controllerId).val(this.prop);
    }
}

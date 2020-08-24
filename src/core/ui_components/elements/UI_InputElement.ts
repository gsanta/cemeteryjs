import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {

    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';
    inputWidth: string;

    change(newVal: any): void {
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        controller.change(this.prop, newVal, this);
    }

    focus(): void {
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        controller.focus(this.prop, this);
    }

    blur(): void {
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        controller.blur(this.prop, this);
    }

    click(): void {
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        controller.click(this.prop, this)
    }

    val(): any {
        // TODO controllerId is deprecated
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        return controller.val(this.prop, this);
    }

    values(): any[] {
        // TODO controllerId is deprecated
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        return controller.values(this.prop, this);
    }
}

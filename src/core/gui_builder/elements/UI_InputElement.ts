import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {
    change(newVal: any): void {
        this.controller.change(this.prop, newVal);
    }

    blur(): void {
        this.controller.blur(this.prop);
    }

    click(): void {
        this.controller.click(this.prop)
    }

    val(): any {
        return this.controller.val(this.prop);
    }
}

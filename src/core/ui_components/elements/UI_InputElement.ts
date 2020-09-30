import { UI_Controller } from "../../plugin/controller/UI_Controller";
import { Registry } from "../../Registry";
import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {

    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';
    inputWidth: string;

    change(newVal: any): void {
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        controller.change(newVal, this);
    }

    focus(): void {
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        controller.focus(this);
    }

    blur(): void {
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        controller.blur(this);
    }

    click(registry: Registry): void {
        let controller: UI_Controller = registry.plugins.getControllers(this.plugin.id).get(this.controllerId);
        if (controller) {
            controller.click(this);
        } else {
            controller = this.controller || this.plugin.getControllerById(this.controllerId);
            controller.click(this)
        }
    }

    val(): any {
        // TODO controllerId is deprecated
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        return controller.val(this);
    }

    values(): any[] {
        // TODO controllerId is deprecated
        const controller = this.controller || this.plugin.getControllerById(this.controllerId);
        return controller.values(this);
    }
}

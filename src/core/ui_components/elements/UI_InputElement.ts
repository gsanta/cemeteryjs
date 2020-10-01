import { Registry } from "../../Registry";
import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {

    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';
    inputWidth: string;

    change(newVal: any, registry: Registry): void {
        registry.plugins.getPropController(this.plugin.id).change(newVal, this);
    }

    focus(registry: Registry): void {
        registry.plugins.getPropController(this.plugin.id).focus(this);
    }

    blur(registry: Registry): void {
        registry.plugins.getPropController(this.plugin.id).blur(this);
    }

    click(registry: Registry): void {
        registry.plugins.getPropController(this.plugin.id).click(this);
    }

    val(registry: Registry): any {
        return registry.plugins.getPropController(this.plugin.id).val(this);
    }

    values(registry: Registry): any[] {
        return registry.plugins.getPropController(this.plugin.id).values(this);
    }
}

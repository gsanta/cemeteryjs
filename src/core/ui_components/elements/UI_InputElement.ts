import { Registry } from "../../Registry";
import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {

    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';
    inputWidth: string;

    change(newVal: any, registry: Registry): void {
        registry.plugins.getPropController(this.pluginId).change(newVal, this);
    }

    focus(registry: Registry): void {
        registry.plugins.getPropController(this.pluginId).focus(this);
    }

    blur(registry: Registry): void {
        registry.plugins.getPropController(this.pluginId).blur(this);
    }

    click(registry: Registry): void {
        registry.plugins.getPropController(this.pluginId).click(this);
    }

    val(registry: Registry): any {
        return registry.plugins.getPropController(this.pluginId).val(this);
    }

    values(registry: Registry): any[] {
        return registry.plugins.getPropController(this.pluginId).values(this);
    }
}

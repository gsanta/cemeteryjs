import { Registry } from "../../Registry";
import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement extends UI_Element {
    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';
    inputWidth: string;

    change(newVal: any, registry: Registry): void {
        if (this.controllerId) {
            registry.plugins.getPanelById(this.pluginId).getFormController(this.controllerId).change(newVal, this);
        } else if (registry.plugins.getPlugin(this.pluginId)) {
            registry.plugins.getPlugin(this.pluginId).getController().change(newVal, this);
        } else {
            registry.plugins.getPropController(this.pluginId).change(newVal, this);
        }
    }

    focus(registry: Registry): void {
        if (this.controllerId) {
            registry.plugins.getPanelById(this.pluginId).getFormController(this.controllerId).focus(this);
        } else if (registry.plugins.getPlugin(this.pluginId)) {
            registry.plugins.getPlugin(this.pluginId).getController().focus(this);
        } else {
            registry.plugins.getPropController(this.pluginId).focus(this);
        }
    }

    blur(registry: Registry): void {
        if (this.controllerId) {
            registry.plugins.getPanelById(this.pluginId).getFormController(this.controllerId).blur(this);
        } else if (registry.plugins.getPlugin(this.pluginId)) {
            registry.plugins.getPlugin(this.pluginId).getController().blur(this);
        } else {
            registry.plugins.getPropController(this.pluginId).blur(this);
        }
    }

    click(registry: Registry): void {
        if (this.controllerId) {
            registry.plugins.getPanelById(this.pluginId).getFormController(this.controllerId).click(this);
        } else if (registry.plugins.getPlugin(this.pluginId)) {
            registry.plugins.getPlugin(this.pluginId).getController().click(this);
        } else {
            registry.plugins.getPropController(this.pluginId).click(this);
        }
    }

    val(registry: Registry): any {
        if (this.controllerId) {
            return registry.plugins.getPanelById(this.pluginId).getFormController(this.controllerId).val(this);
        } else if (registry.plugins.getPlugin(this.pluginId)) {
            registry.plugins.getPlugin(this.pluginId).getController().val(this);
        } else {
            return registry.plugins.getPropController(this.pluginId).val(this);
        }
    }

    values(registry: Registry): any[] {
        if (this.controllerId) {
            return registry.plugins.getPanelById(this.pluginId).getFormController(this.controllerId).values(this);
        } else if (registry.plugins.getPlugin(this.pluginId)) {
            registry.plugins.getPlugin(this.pluginId).getController().values(this);
        } else {
            return registry.plugins.getPropController(this.pluginId).values(this);
        }
    }
}

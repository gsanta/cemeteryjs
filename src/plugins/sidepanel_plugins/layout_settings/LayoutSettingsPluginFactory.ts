import { PropController } from "../../../core/plugin/controller/FormController";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { LayoutSettingsPlugin, LayoutSettingsPluginId } from "./LayoutSettingsPlugin";
import { LayoutControl } from "./LayoutSettingsProps";

export class LayoutSettingsPluginFactory implements PluginFactory {
    pluginId = LayoutSettingsPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new LayoutSettingsPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new LayoutControl()
        ];
    }

    createTools(): Tool[] { return []; }
}
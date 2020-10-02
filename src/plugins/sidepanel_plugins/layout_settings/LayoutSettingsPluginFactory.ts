import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { LayoutSettingsPlugin, LayoutSettingsPluginId } from "./LayoutSettingsPlugin";
import { LayoutControl } from "./LayoutSettingsProps";

export class LayoutSettingsPluginFactory implements UI_PluginFactory {
    pluginId = LayoutSettingsPluginId;
    isGlobalPlugin = true;
    
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
import { Registry } from "../Registry";
import { UI_Controller } from "./controller/UI_Controller";
import { UI_Plugin } from "./UI_Plugin";

export interface PluginFactory {
    pluginId: string;
    createPlugin(registry: Registry): UI_Plugin;
    createControllers(plugin: UI_Plugin, registry: Registry): UI_Controller[];
}
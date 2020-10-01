import { Registry } from "../Registry";
import { PropController } from "./controller/FormController";
import { Tool } from "./tools/Tool";
import { UI_Plugin } from "./UI_Plugin";

export interface PluginFactory {
    pluginId: string;
    createPlugin(registry: Registry): UI_Plugin;
    createPropControllers(plugin: UI_Plugin, registry: Registry): PropController[];
    createTools(plugin: UI_Plugin, registry: Registry): Tool[];
}
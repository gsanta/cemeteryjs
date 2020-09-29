import { Registry } from "../Registry";
import { AbstractController } from "./controller/AbstractController";
import { UI_Plugin } from "./UI_Plugin";

export interface PluginFactory {
    pluginId: string;
    createPlugin(registry: Registry): UI_Plugin;
    createControllers(plugin: UI_Plugin, registry: Registry): AbstractController[];
}
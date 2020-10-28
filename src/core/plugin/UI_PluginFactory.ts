import { Registry } from "../Registry";
import { UI_Layout } from "../ui_components/elements/UI_Layout";
import { AbstractCanvasPlugin } from "./AbstractCanvasPlugin";
import { PropController } from "./controller/FormController";
import { Tool } from "./tools/Tool";
import { UI_Plugin } from "./UI_Plugin";

export interface UI_PluginFactory {
    pluginId: string;
    isGlobalPlugin?: boolean;
    createPlugin(registry: Registry): UI_Plugin;
    createPropControllers(plugin: UI_Plugin, registry: Registry): PropController[];
    createTools(plugin: UI_Plugin, registry: Registry): Tool[];
    createRenderer?(registry: Registry): CanvasRenderer;
    gizmos?: string[]
}

export interface CanvasRenderer {
    renderInto(layout: UI_Layout, plugin: AbstractCanvasPlugin): void;
}
import { Registry } from "../Registry";
import { PropController } from "./controller/FormController";
import { Tool } from "./tools/Tool";
import { UI_Panel } from "./UI_Panel";
import { UI_Container } from '../ui_components/elements/UI_Container';

export interface UI_PluginFactory {
    pluginId: string;
    isGlobalPlugin?: boolean;
    createPlugin(registry: Registry): UI_Panel;
    createPropControllers(plugin: UI_Panel, registry: Registry): PropController[];
    createTools(plugin: UI_Panel, registry: Registry): Tool[];
    createRenderer?(registry: Registry): UI_Renderer;
    gizmos?: string[]
}

export interface UI_Renderer {
    renderInto(layout: UI_Container, plugin: UI_Panel): void;
}
import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { CodeEditorPlugin, CodeEditorPluginId } from "./CodeEditorPlugin";

export class CodeEditorPluginFactory implements UI_PluginFactory {
    pluginId = CodeEditorPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new CodeEditorPlugin(registry);
    }

    createPropControllers(): PropController[] { return []; }
    createTools(plugin: UI_Plugin, registry: Registry): Tool[] { return []; }
}
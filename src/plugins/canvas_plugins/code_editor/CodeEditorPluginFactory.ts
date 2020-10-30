import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { CodeEditorPlugin, CodeEditorPluginId } from "./CodeEditorPlugin";

export class CodeEditorPluginFactory implements UI_PluginFactory {
    pluginId = CodeEditorPluginId;
    
    createPlugin(registry: Registry): UI_Panel {
        return undefined
    }

    createPropControllers(): PropController[] { return []; }
    createTools(plugin: UI_Panel, registry: Registry): Tool[] { return []; }
}
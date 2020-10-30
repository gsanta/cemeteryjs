import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { NodeEditorSettingsPlugin, NodeEditorSettingsPluginId } from "./NodeEditorSettingsPlugin";
import { DragNodeController } from "./NodeEditorSettingsProps";

export class NodeEditorSettingsPluginFactory implements UI_PluginFactory {
    pluginId = NodeEditorSettingsPluginId;
    
    createPlugin(registry: Registry): UI_Panel {
        return new NodeEditorSettingsPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new DragNodeController()
        ];
    }

    createTools(): Tool[] { return []; }
}
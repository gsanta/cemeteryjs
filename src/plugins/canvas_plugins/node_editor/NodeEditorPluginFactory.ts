import { AbstractCanvasPlugin, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPlugin";
import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { NodeEditorPlugin, NodeEditorPluginId } from "./NodeEditorPlugin";
import { JoinTool } from "./tools/JoinTool";

export class NodeEditorPluginFactory implements UI_PluginFactory {
    pluginId = NodeEditorPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new NodeEditorPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new ZoomInController(),
            new ZoomOutController()
        ];
    }

    createTools(plugin: UI_Plugin, registry: Registry): Tool[] {
        return [
            new SelectTool(plugin as AbstractCanvasPlugin, registry),
            new DeleteTool(plugin as AbstractCanvasPlugin, registry),
            new CameraTool(plugin as AbstractCanvasPlugin, registry),
            new JoinTool(plugin as AbstractCanvasPlugin, registry)
        ];
    }
}
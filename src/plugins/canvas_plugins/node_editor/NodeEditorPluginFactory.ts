import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { ToolController } from "../../../core/plugin/controller/ToolController";
import { UI_Controller } from "../../../core/plugin/controller/UI_Controller";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { NodeEditorController } from "./NodeEditorController";
import { NodeEditorPlugin, NodeEditorPluginId } from "./NodeEditorPlugin";
import { JoinTool } from "./tools/JoinTool";

export const NodeEditorToolControllerId = 'node-editor-tool-controller';

export class NodeEditorPluginFactory implements PluginFactory {
    pluginId = NodeEditorPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new NodeEditorPlugin(registry);
    }

    createControllers(plugin: UI_Plugin, registry: Registry): UI_Controller[] {
        const controller = new ToolController(NodeEditorToolControllerId, plugin as AbstractCanvasPlugin, registry);

        controller.registerTool(new SelectTool(plugin as AbstractCanvasPlugin, controller, registry));
        controller.registerTool(new DeleteTool(plugin as AbstractCanvasPlugin, controller, registry));
        controller.registerTool(new CameraTool(plugin as AbstractCanvasPlugin, controller, registry));
        controller.registerTool(new JoinTool(plugin as AbstractCanvasPlugin, controller, registry));

        const nodeEditorController = new NodeEditorController(plugin as AbstractCanvasPlugin, registry);
        
        return [controller, nodeEditorController];
    }
}
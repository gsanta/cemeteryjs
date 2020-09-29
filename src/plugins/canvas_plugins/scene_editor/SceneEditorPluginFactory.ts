import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { ToolController } from "../../../core/plugin/controller/ToolController";
import { UI_Controller } from "../../../core/plugin/controller/UI_Controller";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { SceneEditorPlugin } from "./SceneEditorPlugin";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SpriteTool } from "./tools/SpriteTool";

export const SceneEditorControllerId = 'scene-editor-controller';

export class SceneEditorPluginFactory implements PluginFactory {
    pluginId = SceneEditorControllerId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new SceneEditorPlugin(registry);
    }

    createControllers(plugin: UI_Plugin, registry: Registry): UI_Controller[] {
        const tools: Tool[] = [
            new MeshTool(plugin as AbstractCanvasPlugin, registry),
            new SpriteTool(plugin as AbstractCanvasPlugin, registry),
            new PathTool(plugin as AbstractCanvasPlugin, registry),
            new SelectTool(plugin as AbstractCanvasPlugin, registry),
            new DeleteTool(plugin as AbstractCanvasPlugin, registry),
            new CameraTool(plugin as AbstractCanvasPlugin, registry)
        ]

        const controller = new ToolController(plugin as AbstractCanvasPlugin, registry, tools);
        return [controller];
    }
}
import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { PropController } from "../../../core/plugin/controller/FormController";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { SceneEditorPlugin, SceneEditorPluginId } from "./SceneEditorPlugin";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SpriteTool } from "./tools/SpriteTool";

export const SceneEditorToolControllerId = 'scene-editor-tool-controller'; 

export class SceneEditorPluginFactory implements PluginFactory {
    pluginId = SceneEditorPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new SceneEditorPlugin(registry);
    }

    createPropControllers(plugin: UI_Plugin, registry: Registry): PropController[] {
        return []
    }

    createTools(plugin: UI_Plugin, registry: Registry): Tool[] {
        return [
            new MeshTool(plugin as AbstractCanvasPlugin, registry),
            new SpriteTool(plugin as AbstractCanvasPlugin, registry),
            new PathTool(plugin as AbstractCanvasPlugin, registry),
            new SelectTool(plugin as AbstractCanvasPlugin, registry),
            new DeleteTool(plugin as AbstractCanvasPlugin, registry),
            new CameraTool(plugin as AbstractCanvasPlugin, registry)
        ];
    }
}
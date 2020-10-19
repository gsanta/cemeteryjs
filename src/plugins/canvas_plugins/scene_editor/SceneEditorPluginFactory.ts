import { AbstractCanvasPlugin, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPlugin";
import { PropController } from "../../../core/plugin/controller/FormController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Registry } from "../../../core/Registry";
import { SpriteYAxisHook, YAxisHook as MeshYAxisHook } from "./hooks/YAxisHook";
import { SceneEditorPlugin, SceneEditorPluginId, PrimitiveShapeDropdownControl } from "./SceneEditorPlugin";
import { AxisTool } from "./tools/AxisTool";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SpriteTool } from "./tools/SpriteTool";

export const SceneEditorToolControllerId = 'scene-editor-tool-controller'; 

export class SceneEditorPluginFactory implements UI_PluginFactory {
    pluginId = SceneEditorPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        registry.plugins.engineHooks.registerMeshHook(new MeshYAxisHook(registry));
        registry.plugins.engineHooks.registerSpriteHook(new SpriteYAxisHook(registry));
        return new SceneEditorPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new ZoomInController(),
            new ZoomOutController(),
            new UndoController(),
            new RedoController(),
            new PrimitiveShapeDropdownControl()
        ];
    }

    createTools(plugin: UI_Plugin, registry: Registry): Tool[] {
        return [
            new MeshTool(plugin as AbstractCanvasPlugin, registry),
            new SpriteTool(plugin as AbstractCanvasPlugin, registry),
            new PathTool(plugin as AbstractCanvasPlugin, registry),
            new SelectTool(plugin as AbstractCanvasPlugin, registry),
            new DeleteTool(plugin as AbstractCanvasPlugin, registry),
            new CameraTool(plugin as AbstractCanvasPlugin, registry),
            new AxisTool(plugin as AbstractCanvasPlugin, registry)
        ];
    }
}
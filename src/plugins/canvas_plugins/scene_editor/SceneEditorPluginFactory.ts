import { AbstractCanvasPlugin, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPlugin";
import { PropController } from "../../../core/plugin/controller/FormController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Registry } from "../../../core/Registry";
import { SpriteYAxisHook, YAxisHook as MeshYAxisHook } from "./hooks/YAxisHook";
import { SceneEditorPlugin, SceneEditorPluginId, PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "./SceneEditorPlugin";
import { AxisTool } from "./tools/AxisTool";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SpriteTool } from "./tools/SpriteTool";
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController } from "../../../core/plugin/controller/ToolController";
import { CubeTool } from "./tools/CubeTool";
import { SphereTool } from "./tools/SphereTool";
import { ScaleTool } from "./tools/ScaleTool";

export const SceneEditorToolControllerId = 'scene-editor-tool-controller'; 

// export class SceneEditorPluginFactory implements UI_PluginFactory {
//     pluginId = SceneEditorPluginId;
    
//     createPlugin(registry: Registry): UI_Panel {
//         registry.plugins.engineHooks.registerMeshHook(new MeshYAxisHook(registry));
//         registry.plugins.engineHooks.registerSpriteHook(new SpriteYAxisHook(registry));
//         return new SceneEditorPlugin(registry);
//     }

//     createPropControllers(): PropController[] {
//         return [
//             new ZoomInController(),
//             new ZoomOutController(),
//             new UndoController(),
//             new RedoController(),
//             new PrimitiveShapeDropdownControl(),
//             new PrimitiveShapeDropdownMenuOpenControl(),
//             new CommonToolController(),
//             new SceneEditorToolController(),
//             new CanvasContextDependentToolController()
//         ];
//     }

//     createTools(plugin: UI_Panel, registry: Registry): Tool[] {
//         return [
//             new MeshTool(plugin as AbstractCanvasPlugin, registry),
//             new SpriteTool(plugin as AbstractCanvasPlugin, registry),
//             new PathTool(plugin as AbstractCanvasPlugin, registry),
//             new SelectTool(plugin as AbstractCanvasPlugin, registry),
//             new DeleteTool(plugin as AbstractCanvasPlugin, registry),
//             new CameraTool(plugin as AbstractCanvasPlugin, registry),
//             new AxisTool(plugin as AbstractCanvasPlugin, registry),
//             new CubeTool(plugin as AbstractCanvasPlugin, registry),
//             new SphereTool(plugin as AbstractCanvasPlugin, registry),
//             new ScaleTool(plugin as AbstractCanvasPlugin, registry)
//         ];
//     }
// }
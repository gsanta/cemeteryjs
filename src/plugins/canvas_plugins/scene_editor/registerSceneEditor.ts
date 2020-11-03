import { AbstractCanvasPlugin, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPlugin";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CommonToolController, SceneEditorToolController, CanvasContextDependentToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { cameraInitializer } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { MoveAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/MoveAxisTool";
import { ScaleAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/ScaleAxisTool";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl, SceneEditorPluginId } from "./SceneEditorPlugin";
import { CubeTool } from "./tools/CubeTool";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SphereTool } from "./tools/SphereTool";
import { SpriteTool } from "./tools/SpriteTool";

export function registerSceneEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.plugins.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPlugin {
    const propControllers = [
        new ZoomInController(),
        new ZoomOutController(),
        new UndoController(),
        new RedoController(),
        new PrimitiveShapeDropdownControl(),
        new PrimitiveShapeDropdownMenuOpenControl(),
        new CommonToolController(),
        new SceneEditorToolController(),
        new CanvasContextDependentToolController()
    ]

    const controller = new FormController(this, registry, propControllers);
    const camera = cameraInitializer(SceneEditorPluginId, registry);

    const canvas = new AbstractCanvasPlugin(registry, camera, this.region, SceneEditorPluginId, controller);

    const tools = [
        new MeshTool(this, registry),
        new SpriteTool(this, registry),
        new PathTool(this, registry),
        new SelectTool(this, registry),
        new DeleteTool(this, registry),
        new CameraTool(this, registry),
        new MoveAxisTool(this, registry),
        new CubeTool(this, registry),
        new SphereTool(this, registry),
        new ScaleAxisTool(this, registry)
    ];

    tools.forEach(tool => canvas.addTool(tool));

    return canvas;
}
import { AbstractCanvasPanel, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2DPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CommonToolController, SceneEditorToolController, CanvasContextDependentToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { cameraInitializer } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { MoveAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/MoveAxisTool";
import { ScaleAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/ScaleAxisTool";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "./SceneEditorControllers";
import { CubeTool } from "./tools/CubeTool";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SphereTool } from "./tools/SphereTool";
import { SpriteTool } from "./tools/SpriteTool";

export const SceneEditorPluginId = 'scene-editor-plugin';

export function registerSceneEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
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
    ];

    const tools = [
        new MeshTool(this, registry.data.view.scene, registry),
        new SpriteTool(this, registry.data.view.scene, registry),
        new PathTool(this, registry.data.view.scene, registry),
        new SelectTool(this, registry.data.view.scene, registry),
        new DeleteTool(this, registry.data.view.scene, registry),
        new CameraTool(this, registry),
        new MoveAxisTool(this, registry),
        new CubeTool(this, registry.data.view.scene, registry),
        new SphereTool(this, registry.data.view.scene, registry),
        new ScaleAxisTool(this, registry)
    ];

    const canvas = new Canvas2dPanel(registry, this.region, SceneEditorPluginId, 'Scene editor');
    canvas.setController(new FormController(this, registry, propControllers))
    canvas.setCamera(cameraInitializer(SceneEditorPluginId, registry));
    tools.forEach(tool => canvas.addTool(tool));

    return canvas;
}
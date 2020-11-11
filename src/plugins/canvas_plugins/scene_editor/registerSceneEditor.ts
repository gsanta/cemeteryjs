import { MeshView, MeshViewType } from "../../../core/models/views/MeshView";
import { PathView, PathViewType } from "../../../core/models/views/PathView";
import { AbstractCanvasPanel, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2DPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CommonToolController, SceneEditorToolController, CanvasContextDependentToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { cameraInitializer } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { MoveAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/MoveAxisTool";
import { ScaleAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/ScaleAxisTool";
import { MoveAxisView, MoveAxisViewType } from "../canvas_utility_plugins/canvas_mesh_transformations/views/MoveAxisView";
import { ScaleAxisView, ScaleAxisViewType } from "../canvas_utility_plugins/canvas_mesh_transformations/views/ScaleAxisView";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "./SceneEditorControllers";
import { SceneEditorRenderer } from "./SceneEditorRenderer";
import { CubeTool } from "./tools/CubeTool";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SphereTool } from "./tools/SphereTool";
import { SpriteTool } from "./tools/SpriteTool";

export const SceneEditorPanelId = 'scene-editor-panel';

export function registerSceneEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas2dPanel(registry, UI_Region.Canvas1, SceneEditorPanelId, 'Scene editor');

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
        new MeshTool(canvas, registry.data.view.scene, registry),
        new SpriteTool(canvas, registry.data.view.scene, registry),
        new PathTool(canvas, registry.data.view.scene, registry),
        new SelectTool(canvas, registry.data.view.scene, registry),
        new DeleteTool(canvas, registry.data.view.scene, registry),
        new CameraTool(canvas, registry),
        new MoveAxisTool(canvas, registry),
        new CubeTool(canvas, registry.data.view.scene, registry),
        new SphereTool(canvas, registry.data.view.scene, registry),
        new ScaleAxisTool(canvas, registry)
    ];

    canvas.renderer = new SceneEditorRenderer(registry, canvas);
    canvas.setController(new FormController(undefined, registry, propControllers))
    canvas.setCamera(cameraInitializer(SceneEditorPanelId, registry));
    tools.forEach(tool => canvas.addTool(tool));

    registry.data.view.scene.registerViewType(MeshViewType, () => new MeshView());
    registry.data.view.scene.registerViewType(MoveAxisViewType, () => new MoveAxisView(registry));
    registry.data.view.scene.registerViewType(ScaleAxisViewType, () => new ScaleAxisView(registry));
    registry.data.view.scene.registerViewType(PathViewType, () => new PathView());

    return canvas;
}
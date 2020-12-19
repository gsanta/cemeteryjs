import { LightViewType } from "./views/LightView";
import { MeshViewType } from "./views/MeshView";
import { PathViewType } from "./views/PathView";
import { SpriteViewType } from "./views/SpriteView";
import { AbstractCanvasPanel, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2dPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { cameraInitializer } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { MoveAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/MoveAxisTool";
import { ScaleAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/ScaleAxisTool";
import { MoveAxisViewFactory, MoveAxisViewType } from "../canvas_utility_plugins/canvas_mesh_transformations/views/MoveAxisView";
import { ScaleAxisViewFactory, ScaleAxisViewType } from "../canvas_utility_plugins/canvas_mesh_transformations/views/ScaleAxisView";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "./SceneEditorControllers";
import { SceneEditorRenderer } from "./SceneEditorRenderer";
import { CubeTool } from "./tools/CubeTool";
import { LightTool } from "./tools/LightTool";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SphereTool } from "./tools/SphereTool";
import { SpriteTool } from "./tools/SpriteTool";
import { MeshViewFactory } from "./views/MeshViewFactory";
import { LightViewFactory } from "./views/LightViewFactory";
import { SpriteViewFactory } from "./views/SpriteViewFactory";
import { PathViewFactory } from "./views/PathViewFactory";
import { GroundTool } from "./tools/GroundTool";
import { RotateAxisViewFactory, RotateAxisViewType } from "../canvas_utility_plugins/canvas_mesh_transformations/views/RotateAxisView";
import { RotateAxisTool } from "../canvas_utility_plugins/canvas_mesh_transformations/tools/RotateAxisTool";

export const SceneEditorPanelId = 'scene-editor';

export function registerSceneEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas2dPanel(registry, UI_Region.Canvas1, SceneEditorPanelId, 'Scene editor');

    const propControllers = [
        new ZoomInController(registry),
        new ZoomOutController(registry),
        new UndoController(registry),
        new RedoController(registry),
        new PrimitiveShapeDropdownControl(registry),
        new PrimitiveShapeDropdownMenuOpenControl(registry),
        new CommonToolController(registry),
        new SceneEditorToolController(registry),
        new CanvasContextDependentToolController(registry),
    ];

    const tools = [
        new MeshTool(canvas, registry.data.view.scene, registry),
        new SpriteTool(canvas, registry.data.view.scene, registry),
        new LightTool(canvas,  registry.data.view.scene, registry),
        new PathTool(canvas, registry.data.view.scene, registry),
        new SelectTool(canvas, registry.data.view.scene, registry),
        new DeleteTool(canvas, registry.data.view.scene, registry),
        new CameraTool(canvas, registry),
        new MoveAxisTool(canvas, registry),
        new CubeTool(canvas, registry.data.view.scene, registry),
        new SphereTool(canvas, registry.data.view.scene, registry),
        new GroundTool(canvas, registry.data.view.scene, registry),
        new ScaleAxisTool(canvas, registry),
        new RotateAxisTool(canvas, registry)
    ];

    canvas.renderer = new SceneEditorRenderer(registry, canvas);
    canvas.setController(new FormController(undefined, registry, propControllers))
    canvas.setCamera(cameraInitializer(SceneEditorPanelId, registry));
    canvas.setViewStore(registry.data.view.scene);
    tools.forEach(tool => canvas.addTool(tool));

    registry.data.view.scene.registerViewType(MeshViewType, new MeshViewFactory(registry));
    registry.data.view.scene.registerViewType(SpriteViewType, new SpriteViewFactory(registry));
    registry.data.view.scene.registerViewType(LightViewType, new LightViewFactory(registry));

    registry.data.view.scene.registerViewType(MoveAxisViewType, new MoveAxisViewFactory(registry));
    registry.data.view.scene.registerViewType(ScaleAxisViewType, new ScaleAxisViewFactory(registry));
    registry.data.view.scene.registerViewType(RotateAxisViewType, new RotateAxisViewFactory(registry));
    registry.data.view.scene.registerViewType(PathViewType, new PathViewFactory(registry));

    return canvas;
}
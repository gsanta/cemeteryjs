import { LightViewType } from "./models/views/LightView";
import { MeshViewType } from "./models/views/MeshView";
import { PathViewType } from "./models/views/PathView";
import { SpriteViewType } from "./models/views/SpriteView";
import { AbstractCanvasPanel, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2dPanel";
import { FormController } from "../../../core/controller/FormController";
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController } from "../../../core/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { cameraInitializer } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { MoveAxisTool } from "./controllers/tools/MoveAxisTool";
import { ScaleAxisTool } from "./controllers/tools/ScaleAxisTool";
import { MoveAxisViewFactory, MoveAxisViewType } from "./models/views/edit/MoveAxisView";
import { ScaleAxisViewFactory, ScaleAxisViewType } from "./models/views/edit/ScaleAxisView";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "./controllers/SceneEditorToolbarController";
import { SceneEditorRenderer } from "./renderers/SceneEditorRenderer";
import { CubeTool } from "./controllers/tools/CubeTool";
import { LightTool } from "./controllers/tools/LightTool";
import { MeshTool } from "./controllers/tools/MeshTool";
import { PathTool } from "./controllers/tools/PathTool";
import { SphereTool } from "./controllers/tools/SphereTool";
import { SpriteTool } from "./controllers/tools/SpriteTool";
import { MeshViewFactory } from "./models/factories/MeshViewFactory";
import { LightViewFactory } from "./models/factories/LightViewFactory";
import { SpriteViewFactory } from "./models/factories/SpriteViewFactory";
import { PathViewFactory } from "./models/factories/PathViewFactory";
import { GroundTool } from "./controllers/tools/GroundTool";
import { RotateAxisViewFactory, RotateAxisViewType } from "./models/views/edit/RotateAxisView";
import { RotateAxisTool } from "./controllers/tools/RotateAxisTool";
import { UIModule } from "../../../core/services/ModuleService";
import { SceneEditorExporter } from "./io/SceneEditorExporter";

export const SceneEditorPanelId = 'scene-editor';

export function registerSceneEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    const module: UIModule = {
        moduleName: SceneEditorPanelId,
        panels: [canvas],
        exporter: new SceneEditorExporter(registry)
    }

    registry.services.module.registerUIModule(module);

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
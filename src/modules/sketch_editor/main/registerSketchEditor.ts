import { LightShapeType } from "./models/shapes/LightShape";
import { MeshShapeType } from "./models/shapes/MeshShape";
import { PathShapeType } from "./models/shapes/PathShape";
import { SpriteShapeType } from "./models/shapes/SpriteShape";
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
import { MoveAxisShapeFactory, MoveAxisShapeType } from "./models/shapes/edit/MoveAxisShape";
import { ScaleAxisShapeFactory, ScaleAxisShapeType } from "./models/shapes/edit/ScaleAxisShape";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "../contribs/toolbar/controllers/SceneEditorToolbarController";
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
import { RotateAxisShapeFactory, RotateAxisShapeType } from "./models/shapes/edit/RotateAxisShape";
import { RotateAxisTool } from "./controllers/tools/RotateAxisTool";
import { UIModule } from "../../../core/services/ModuleService";
import { SceneEditorExporter } from "./io/SceneEditorExporter";
import { SceneEditorImporter } from "./io/SceneEditorImporter";
import { SceneToSketchSynchronizer } from "./SceneToSketchSynchronizer";
import { ShapeObservable } from "../../../core/models/ShapeObservable";
import { SketchToSceneSynchronizer } from "./SketchToSceneSynchronizer";

export const SketchEditorPanelId = 'sketch-editor';

export function registerSketchEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    const module: UIModule = {
        moduleName: SketchEditorPanelId,
        panels: [canvas],
        exporter: new SceneEditorExporter(registry),
        importer: new SceneEditorImporter(registry)
    }

    registry.services.module.registerUIModule(module);

}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas2dPanel(registry, UI_Region.Canvas1, SketchEditorPanelId, 'Scene editor');

    const observable = new ShapeObservable();
    const sketchToSceneSynchronizer = new SketchToSceneSynchronizer(registry, observable);

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
        new MeshTool(canvas, registry.data.shape.scene, registry),
        new SpriteTool(canvas, registry.data.shape.scene, registry),
        new LightTool(canvas,  registry.data.shape.scene, registry),
        new PathTool(canvas, registry.data.shape.scene, registry),
        new SelectTool(canvas, registry.data.shape.scene, registry),
        new DeleteTool(canvas, registry.data.shape.scene, registry),
        new CameraTool(canvas, registry),
        new MoveAxisTool(canvas, registry, observable),
        new CubeTool(canvas, registry.data.shape.scene, registry),
        new SphereTool(canvas, registry.data.shape.scene, registry),
        new GroundTool(canvas, registry.data.shape.scene, registry),
        new ScaleAxisTool(canvas, registry, observable),
        new RotateAxisTool(canvas, registry, observable)
    ];

    canvas.renderer = new SceneEditorRenderer(registry, canvas);
    canvas.setController(new FormController(undefined, registry, propControllers))
    canvas.setCamera(cameraInitializer(SketchEditorPanelId, registry));
    canvas.setViewStore(registry.data.shape.scene);
    tools.forEach(tool => canvas.addTool(tool));

    registry.data.shape.scene.registerViewType(MeshShapeType, new MeshViewFactory(registry));
    registry.data.shape.scene.registerViewType(SpriteShapeType, new SpriteViewFactory(registry));
    registry.data.shape.scene.registerViewType(LightShapeType, new LightViewFactory(registry));

    registry.data.shape.scene.registerViewType(MoveAxisShapeType, new MoveAxisShapeFactory(registry));
    registry.data.shape.scene.registerViewType(ScaleAxisShapeType, new ScaleAxisShapeFactory(registry));
    registry.data.shape.scene.registerViewType(RotateAxisShapeType, new RotateAxisShapeFactory(registry));
    registry.data.shape.scene.registerViewType(PathShapeType, new PathViewFactory(registry));

    new SceneToSketchSynchronizer(registry);

    return canvas;
}
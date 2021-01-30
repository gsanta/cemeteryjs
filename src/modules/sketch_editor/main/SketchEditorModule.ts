import { FormController } from "../../../core/controller/FormController";
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController } from "../../../core/controller/ToolHandler";
import { Camera2D } from "../../../core/models/misc/camera/Camera2D";
import { ShapeObservable } from "../../../core/models/ShapeObservable";
import { AbstractShape } from "../../../core/models/shapes/AbstractShape";
import { RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2dPanel";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AbstractModuleExporter } from "../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../core/services/import/AbstractModuleImporter";
import { Point } from "../../../utils/geometry/shapes/Point";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "../contribs/toolbar/controllers/SceneEditorToolbarController";
import { CubeTool } from "./controllers/tools/CubeTool";
import { GroundTool } from "./controllers/tools/GroundTool";
import { LightTool } from "./controllers/tools/LightTool";
import { MeshTool } from "./controllers/tools/MeshTool";
import { MoveAxisTool } from "./controllers/tools/MoveAxisTool";
import { PathTool } from "./controllers/tools/PathTool";
import { RotateAxisTool } from "./controllers/tools/RotateAxisTool";
import { ScaleAxisTool } from "./controllers/tools/ScaleAxisTool";
import { SphereTool } from "./controllers/tools/SphereTool";
import { SpriteTool } from "./controllers/tools/SpriteTool";
import { SceneEditorExporter } from "./io/SceneEditorExporter";
import { SceneEditorImporter } from "./io/SceneEditorImporter";
import { LightViewFactory } from "./models/factories/LightViewFactory";
import { MeshViewFactory } from "./models/factories/MeshViewFactory";
import { PathViewFactory } from "./models/factories/PathViewFactory";
import { SpriteViewFactory } from "./models/factories/SpriteViewFactory";
import { MoveAxisShapeFactory, MoveAxisShapeType } from "./models/shapes/edit/MoveAxisShape";
import { RotateAxisShapeFactory, RotateAxisShapeType } from "./models/shapes/edit/RotateAxisShape";
import { ScaleAxisShapeFactory, ScaleAxisShapeType } from "./models/shapes/edit/ScaleAxisShape";
import { LightShapeType } from "./models/shapes/LightShape";
import { MeshShapeType } from "./models/shapes/MeshShape";
import { PathShapeType } from "./models/shapes/PathShape";
import { SpriteShapeType } from "./models/shapes/SpriteShape";
import { SceneEditorRenderer } from "./renderers/SceneEditorRenderer";
import { SceneToSketchSynchronizer } from "./SceneToSketchSynchronizer";
import { SketchToSceneSynchronizer } from "./SketchToSceneSynchronizer";

export const DUMMY_CAMERA_SIZE = new Point(100, 100);

export const SketchEditorPanelId = 'sketch-editor';

export class SketchEditorModule extends Canvas2dPanel<AbstractShape> {

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas1, SketchEditorPanelId, 'Sketch editor');

        this.exporter = new SceneEditorExporter(registry);
        this.importer = new SceneEditorImporter(registry);
        
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
            new MeshTool(this, registry.data.shape.scene, registry),
            new SpriteTool(this, registry.data.shape.scene, registry),
            new LightTool(this,  registry.data.shape.scene, registry),
            new PathTool(this, registry.data.shape.scene, registry),
            new SelectTool(this, registry.data.shape.scene, registry),
            new DeleteTool(this, registry.data.shape.scene, registry),
            new CameraTool(this, registry),
            new MoveAxisTool(this, registry, observable),
            new CubeTool(this, registry.data.shape.scene, registry),
            new SphereTool(this, registry.data.shape.scene, registry),
            new GroundTool(this, registry.data.shape.scene, registry),
            new ScaleAxisTool(this, registry, observable),
            new RotateAxisTool(this, registry, observable)
        ];
    
        this.renderer = new SceneEditorRenderer(registry, this);
        this.setController(new FormController(undefined, registry, propControllers))
        this.setCamera(this.cameraInitializer(SketchEditorPanelId, registry));
        this.setViewStore(registry.data.shape.scene);
        tools.forEach(tool => this.addTool(tool));
    
        registry.data.shape.scene.registerViewType(MeshShapeType, new MeshViewFactory(registry));
        registry.data.shape.scene.registerViewType(SpriteShapeType, new SpriteViewFactory(registry));
        registry.data.shape.scene.registerViewType(LightShapeType, new LightViewFactory(registry));
    
        registry.data.shape.scene.registerViewType(MoveAxisShapeType, new MoveAxisShapeFactory(registry));
        registry.data.shape.scene.registerViewType(ScaleAxisShapeType, new ScaleAxisShapeFactory(registry));
        registry.data.shape.scene.registerViewType(RotateAxisShapeType, new RotateAxisShapeFactory(registry));
        registry.data.shape.scene.registerViewType(PathShapeType, new PathViewFactory(registry));
    
        new SceneToSketchSynchronizer(registry);
    }

    private cameraInitializer(canvasId: string, registry: Registry) {
        const screenSize = this.getScreenSize(canvasId);
        if (screenSize) {
            return new Camera2D(registry, this, new Point(screenSize.x, screenSize.y));
        } else {
            return new Camera2D(registry, this, DUMMY_CAMERA_SIZE);
        }
    }


    private getScreenSize(canvasId: string): Point {
        if (typeof document !== 'undefined') {
            const svg: HTMLElement = document.getElementById(canvasId);

            if (svg) {
                const rect: ClientRect = svg.getBoundingClientRect();
                return new Point(rect.width, rect.height);
            }
        }
        return undefined;
    }
}

// export function registerSketchEditor(registry: Registry) {
//     const canvas = createCanvas(registry);

//     const module: UIModule = {
//         moduleName: SketchEditorPanelId,
//         panels: [canvas],
//         exporter: new SceneEditorExporter(registry),
//         importer: new SceneEditorImporter(registry)
//     }

//     registry.services.module.registerUIModule(module);

// }

// function createCanvas(registry: Registry): AbstractCanvasPanel {
//     const canvas = new Canvas2dPanel(registry, UI_Region.Canvas1, SketchEditorPanelId, 'Scene editor');

//     const observable = new ShapeObservable();
//     const sketchToSceneSynchronizer = new SketchToSceneSynchronizer(registry, observable);

//     const propControllers = [
//         new ZoomInController(registry),
//         new ZoomOutController(registry),
//         new UndoController(registry),
//         new RedoController(registry),
//         new PrimitiveShapeDropdownControl(registry),
//         new PrimitiveShapeDropdownMenuOpenControl(registry),
//         new CommonToolController(registry),
//         new SceneEditorToolController(registry),
//         new CanvasContextDependentToolController(registry),
//     ];

//     const tools = [
//         new MeshTool(canvas, registry.data.shape.scene, registry),
//         new SpriteTool(canvas, registry.data.shape.scene, registry),
//         new LightTool(canvas,  registry.data.shape.scene, registry),
//         new PathTool(canvas, registry.data.shape.scene, registry),
//         new SelectTool(canvas, registry.data.shape.scene, registry),
//         new DeleteTool(canvas, registry.data.shape.scene, registry),
//         new CameraTool(canvas, registry),
//         new MoveAxisTool(canvas, registry, observable),
//         new CubeTool(canvas, registry.data.shape.scene, registry),
//         new SphereTool(canvas, registry.data.shape.scene, registry),
//         new GroundTool(canvas, registry.data.shape.scene, registry),
//         new ScaleAxisTool(canvas, registry, observable),
//         new RotateAxisTool(canvas, registry, observable)
//     ];

//     canvas.renderer = new SceneEditorRenderer(registry, canvas);
//     canvas.setController(new FormController(undefined, registry, propControllers))
//     canvas.setCamera(cameraInitializer(SketchEditorPanelId, registry));
//     canvas.setViewStore(registry.data.shape.scene);
//     tools.forEach(tool => canvas.addTool(tool));

//     registry.data.shape.scene.registerViewType(MeshShapeType, new MeshViewFactory(registry));
//     registry.data.shape.scene.registerViewType(SpriteShapeType, new SpriteViewFactory(registry));
//     registry.data.shape.scene.registerViewType(LightShapeType, new LightViewFactory(registry));

//     registry.data.shape.scene.registerViewType(MoveAxisShapeType, new MoveAxisShapeFactory(registry));
//     registry.data.shape.scene.registerViewType(ScaleAxisShapeType, new ScaleAxisShapeFactory(registry));
//     registry.data.shape.scene.registerViewType(RotateAxisShapeType, new RotateAxisShapeFactory(registry));
//     registry.data.shape.scene.registerViewType(PathShapeType, new PathViewFactory(registry));

//     new SceneToSketchSynchronizer(registry);

//     return canvas;
// }
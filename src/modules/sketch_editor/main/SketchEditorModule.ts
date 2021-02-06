import { FormController } from "../../../core/controller/FormController";
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController } from "../../../core/controller/ToolHandler";
import { ItemData } from "../../../core/lookups/ItemData";
import { Camera2D } from "../../../core/models/misc/camera/Camera2D";
import { ShapeObservable } from "../../../core/models/ShapeObservable";
import { AbstractShape } from "../../../core/models/shapes/AbstractShape";
import { RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2dPanel";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { PointerToolLogicForSvgCanvas } from "../../../core/plugin/tools/PointerTool";
import { SelectionToolLogicForSvgCanvas, SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AbstractModuleExporter } from "../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../core/services/import/AbstractModuleImporter";
import { SelectionStoreForSketchEditor } from "../../../core/stores/SelectionStoreForSketchEditor";
import { ShapeLifeCycleHook, ShapeStore } from "../../../core/stores/ShapeStore";
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
import { SketchEditorRenderer } from "./renderers/SketchEditorRenderer";
import { SceneToSketchSynchronizer } from "./SceneToSketchSynchronizer";
import { SketchToSceneSynchronizer } from "./SketchToSceneSynchronizer";

export const DUMMY_CAMERA_SIZE = new Point(100, 100);

export const SketchEditorPanelId = 'sketch-editor';

export class SketchEditorModule extends Canvas2dPanel<AbstractShape> {

    data: ItemData<AbstractShape>

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    observable: ShapeObservable;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas1, SketchEditorPanelId, 'Sketch editor');

        this.observable = new ShapeObservable();

        this.data = {
            items: ShapeStore.newInstance(registry, this),
            selection: new SelectionStoreForSketchEditor(this)
        }

        registry.data.sketch = this.data;
        registry.data.sketch.items = <ShapeStore> this.data.items;
        (this.registry.data.sketch.items as ShapeStore).addHook(new ShapeLifeCycleHook(this.registry));

        this.exporter = new SceneEditorExporter(registry);
        this.importer = new SceneEditorImporter(registry);
        
        const sketchToSceneSynchronizer = new SketchToSceneSynchronizer(registry, this.observable);
    
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
            new MeshTool(this, registry),
            new SpriteTool(this, registry),
            new LightTool(this, registry),
            new PathTool(new PointerToolLogicForSvgCanvas(registry, this), this, registry),
            new SelectTool(new PointerToolLogicForSvgCanvas(registry, this), new SelectionToolLogicForSvgCanvas(registry, this), this, registry),
            new DeleteTool(new PointerToolLogicForSvgCanvas(registry, this), this, registry),
            new CameraTool(this, registry),
            new MoveAxisTool(this, registry, this.observable),
            new CubeTool(this, registry),
            new SphereTool(this, registry),
            new GroundTool(this, registry),
            new ScaleAxisTool(this, registry, this.observable),
            new RotateAxisTool(this, registry, this.observable)
        ];
    
        this.renderer = new SketchEditorRenderer(registry, this);
        this.setController(new FormController(undefined, registry, propControllers))
        this.setCamera(this.cameraInitializer(SketchEditorPanelId, registry));
        tools.forEach(tool => this.addTool(tool));
    
        new SceneToSketchSynchronizer(registry);
    }

    private cameraInitializer(canvasId: string, registry: Registry) {
        const screenSize = this.getScreenSize(canvasId);
        if (screenSize) {
            return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
        } else {
            return new Camera2D(registry, DUMMY_CAMERA_SIZE);
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
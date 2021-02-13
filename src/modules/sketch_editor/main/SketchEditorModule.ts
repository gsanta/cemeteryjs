import { FormController } from "../../../core/controller/FormController";
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController } from "../../../core/controller/ToolHandler";
import { CameraTool } from "../../../core/controller/tools/CameraTool";
import { DeleteTool_Svg } from "../../../core/controller/tools/DeleteTool_Svg";
import { SelectTool_Svg } from "../../../core/controller/tools/SelectTool_Svg";
import { ItemData } from "../../../core/data/ItemData";
import { SelectionStoreForSketchEditor } from "../../../core/data/stores/SelectionStoreForSketchEditor";
import { ShapeLifeCycleHook, ShapeStore } from "../../../core/data/stores/ShapeStore";
import { TagStore } from "../../../core/data/stores/TagStore";
import { Camera2D } from "../../../core/models/misc/camera/Camera2D";
import { RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/models/modules/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/models/modules/Canvas2dPanel";
import { AbstractShape } from "../../../core/models/shapes/AbstractShape";
import { UI_Region } from "../../../core/models/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AbstractModuleExporter } from "../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../core/services/import/AbstractModuleImporter";
import { Point } from "../../../utils/geometry/shapes/Point";
import { PrimitiveShapeDropdownControl, PrimitiveShapeDropdownMenuOpenControl } from "../contribs/toolbar/controllers/SceneEditorToolbarController";
import { CubeTool } from "./controllers/tools/CubeTool";
import { GroundTool } from "./controllers/tools/GroundTool";
import { LightTool } from "./controllers/tools/LightTool";
import { MeshTool } from "./controllers/tools/MeshTool";
import { PathTool_Svg } from "./controllers/tools/PathTool_Svg";
import { SphereTool } from "./controllers/tools/SphereTool";
import { SpriteTool } from "./controllers/tools/SpriteTool";
import { Exporter_Sketch } from "./io/Exporter_Sketch";
import { Importer_Sketch } from "./io/Importer_Sketch";
import { SketchEditorRenderer } from "./renderers/SketchEditorRenderer";
import { SceneToSketchSynchronizer } from "./SceneToSketchSynchronizer";

export const DUMMY_CAMERA_SIZE = new Point(100, 100);

export const SketchEditorPanelId = 'sketch-editor';

export class SketchEditorModule extends Canvas2dPanel {

    data: ItemData<AbstractShape>

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas1, SketchEditorPanelId, 'Sketch editor');

        this.data = {
            items: ShapeStore.newInstance(registry, this),
            selection: new SelectionStoreForSketchEditor(this),
            tags: new TagStore(this)
        }

        registry.data.sketch = this.data;
        registry.data.sketch.items = <ShapeStore> this.data.items;
        (this.registry.data.sketch.items as ShapeStore).addHook(new ShapeLifeCycleHook(this.registry));

        this.exporter = new Exporter_Sketch(registry);
        this.importer = new Importer_Sketch(this, registry);
    
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
            new PathTool_Svg(this, registry),
            new SelectTool_Svg(this, registry),
            new DeleteTool_Svg(this, registry),
            new CameraTool(this, registry),
            new CubeTool(this, registry),
            new SphereTool(this, registry),
            new GroundTool(this, registry),
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
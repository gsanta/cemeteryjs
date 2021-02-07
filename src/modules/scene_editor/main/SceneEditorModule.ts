import { EngineEventAdapter } from "../../../core/controller/EngineEventAdapter";
import { FormController } from "../../../core/controller/FormController";
import { AxisGizmoType } from "../../../core/engine/adapters/babylonjs/gizmos/Bab_AxisGizmo";
import { ItemData } from "../../../core/data/ItemData";
import { IObj } from "../../../core/models/objs/IObj";
import { Canvas3dPanel } from "../../../core/models/modules/Canvas3dPanel";
import { CameraTool } from "../../../core/controller/tools/CameraTool";
import { PointerToolLogicForWebGlCanvas } from "../../../core/controller/tools/PointerTool";
import { SelectionToolLogicForWebGlCanvas, SelectTool, SelectToolId } from "../../../core/controller/tools/SelectTool";
import { UI_Region } from "../../../core/models/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AbstractModuleExporter } from "../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../core/services/import/AbstractModuleImporter";
import { ObjSelectionStore } from "../../../core/data/stores/ObjSelectionStore";
import { ObjStore } from "../../../core/data/stores/ObjStore";
import { Point } from "../../../utils/geometry/shapes/Point";
import { SceneEditorToolbarController } from "../contribs/toolbar/SceneEditorToolbarController";
import { GameTool } from "./controllers/tools/GameTool";
import { SceneEditorRenderer } from "./renderers/SceneEditorRenderer";
import { SelectTool_Svg } from "../../../core/controller/tools/SelectTool_Svg";
import { SelectTool_Webgl } from "../../../core/controller/tools/SelectTool_Webgl";
import { TagStore } from "../../../core/data/stores/TagStore";
(<any> window).earcut = require('earcut');

export const SceneEditorPanelId = 'scene-viewer'; 
export const SceneEditorPluginControllerId = 'scene-editor-plugin-controller';

export class SceneEditorModule extends Canvas3dPanel<IObj> {
    showBoundingBoxes: boolean = false;
    selectedTool: string;

    data: ItemData<IObj>;

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas2, SceneEditorPanelId, 'Scene Editor');

        this.engine = registry.engine;
        this.data = {
            items: new ObjStore(),
            selection: new ObjSelectionStore(),
            tags: new TagStore()
        }

        this.registry.data.scene = this.data;

        this.engineEventAdapter = new EngineEventAdapter(registry, this);
        this.engineEventAdapter.register();

        const tools = [
            new GameTool(this, registry),
            new CameraTool(this, registry),
            new SelectTool_Webgl(this, registry)
        ];
        
        const controller = new SceneEditorToolbarController(registry, this);
        this.setController(new FormController(this, registry, [], controller));
        this.setCamera(registry.engine.getCamera());
        this.renderer = new SceneEditorRenderer(this, controller);
        tools.forEach(tool => this.addTool(tool));
    
        this.onMounted(() => {
            registry.engine.setup(document.querySelector(`#${SceneEditorPanelId} canvas`));
            registry.engine.resize();
        });
    
        this.onUnmounted(() => registry.engine.meshLoader.clear());

        registry.engine.onReady(() => {
            registry.engine.gizmos.showGizmo(AxisGizmoType);
            registry.engine.gizmos.setGizmoPosition(AxisGizmoType, new Point(2.5, 3.2));
            
            this.tool.setSelectedTool(SelectToolId);
        });
    }
}
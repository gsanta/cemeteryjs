import { EngineEventAdapter } from "../../../core/controller/EngineEventAdapter";
import { FormController } from "../../../core/controller/FormController";
import { AxisGizmoType } from "../../../core/engine/adapters/babylonjs/gizmos/Bab_AxisGizmo";
import { IObj } from "../../../core/models/objs/IObj";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { PointerToolLogicForWebGlCanvas } from "../../../core/plugin/tools/PointerTool";
import { SelectionToolLogicForWebGlCanvas, SelectTool, SelectToolId } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AbstractModuleExporter } from "../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../core/services/import/AbstractModuleImporter";
import { ObjStore } from "../../../core/stores/ObjStore";
import { Point } from "../../../utils/geometry/shapes/Point";
import { SceneEditorToolbarController } from "../contribs/toolbar/SceneEditorToolbarController";
import { GameTool } from "./controllers/tools/GameTool";
import { SceneEditorRenderer } from "./renderers/SceneEditorRenderer";
(<any> window).earcut = require('earcut');

export const SceneEditorPanelId = 'scene-viewer'; 
export const SceneEditorPluginControllerId = 'scene-editor-plugin-controller';

export class SceneEditorModule extends Canvas3dPanel<IObj> {
    showBoundingBoxes: boolean = false;
    selectedTool: string;

    store: ObjStore;

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas2, SceneEditorPanelId, 'Scene Editor');

        this.store = registry.stores.objStore;
        this.engine = registry.engine;

        this.engineEventAdapter = new EngineEventAdapter(registry, this);
        this.engineEventAdapter.register();

        const tools = [
            new GameTool(this, registry),
            new CameraTool(this, registry),
            new SelectTool(new PointerToolLogicForWebGlCanvas(registry, this), new SelectionToolLogicForWebGlCanvas(registry, this), this, registry)
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
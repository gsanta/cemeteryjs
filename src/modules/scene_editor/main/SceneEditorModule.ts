import { FormController } from "../../../core/controller/FormController";
import { AxisGizmoType } from "../../../core/engine/adapters/babylonjs/gizmos/Bab_AxisGizmo";
import { AbstractCanvasPanel } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AbstractModuleExporter } from "../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../core/services/import/AbstractModuleImporter";
import { Point } from "../../../utils/geometry/shapes/Point";
import { GameViewerToolbarController } from "../contribs/toolbar/GameViewerToolbarController";
import { GameTool } from "./controllers/tools/GameTool";
import { GameViewerModel } from "./models/GameViewerModel";
import { GameViewerRenderer } from "./renderers/GameViewerRenderer";
(<any> window).earcut = require('earcut');

export const SceneEditorPanelId = 'scene-viewer'; 
export const SceneEditorPluginControllerId = 'scene-editor-plugin-controller';

export class SceneEditorModule extends Canvas3dPanel {

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas2, SceneEditorPanelId, 'Scene Editor');

        this.model = new GameViewerModel(registry);

        const tools = [
            new GameTool(this, registry),
            new CameraTool(this, registry)
        ];
        
        const controller = new GameViewerToolbarController(registry, this);
        this.setController(new FormController(this, registry, [], controller));
        this.setCamera(registry.engine.getCamera());
        this.renderer = new GameViewerRenderer(this, controller);
        tools.forEach(tool => this.addTool(tool));
    
        this.onMounted(() => {
            registry.engine.setup(document.querySelector(`#${SceneEditorPanelId} canvas`));
            registry.engine.resize();
        
            this.getGizmos().forEach(gizmo => gizmo.mount());
        });
    
        this.onUnmounted(() => registry.engine.meshLoader.clear());

        registry.engine.onReady(() => {
            registry.engine.gizmos.showGizmo(AxisGizmoType);
            registry.engine.gizmos.setGizmoPosition(AxisGizmoType, new Point(2.5, 3.2));
        });
    }
}


// export function registerSceneEditor(registry: Registry) {
//     const canvas = createCanvas(registry);

//     registry.services.module.registerUIModule({ moduleName: SceneEditorPanelId, panels: [canvas]});

//     registry.engine.onReady(() => {
//         registry.engine.gizmos.showGizmo(AxisGizmoType);
//         registry.engine.gizmos.setGizmoPosition(AxisGizmoType, new Point(2.5, 3.2));
//     });
// }

// function createCanvas(registry: Registry): AbstractCanvasPanel<GameViewerModel> {
//     const canvas = new Canvas3dPanel(registry, UI_Region.Canvas2, SceneEditorPanelId, 'Game viewer');
//     canvas.model = new GameViewerModel(registry);

//     const tools = [
//         new GameTool(canvas, registry),
//         new CameraTool(canvas, registry)
//     ];
    
//     const controller = new GameViewerToolbarController(registry, canvas);
//     canvas.setController(new FormController(canvas, registry, [], controller));
//     canvas.setCamera(registry.engine.getCamera());
//     canvas.renderer = new GameViewerRenderer(canvas, controller);
//     tools.forEach(tool => canvas.addTool(tool));

//     canvas.onMounted(() => {
//         registry.engine.setup(document.querySelector(`#${SceneEditorPanelId} canvas`));
//         registry.engine.resize();
    
//         canvas.getGizmos().forEach(gizmo => gizmo.mount());
//     });

//     canvas.onUnmounted(() => registry.engine.meshLoader.clear());

//     return canvas;
// }
import { FormController } from "../../../core/controller/FormController";
import { AxisGizmoType } from "../../../core/engine/adapters/babylonjs/gizmos/Bab_AxisGizmo";
import { AbstractCanvasPanel } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { Point } from "../../../utils/geometry/shapes/Point";
import { GameViewerToolbarController } from "./controllers/GameViewerToolbarController";
import { GameTool } from "./controllers/tools/GameTool";
import { GameViewerModel } from "./GameViewerModel";
import { GameViewerRenderer } from "./renderers/GameViewerRenderer";
(<any> window).earcut = require('earcut');

export const GameViewerPanelId = 'game-viewer'; 
export const GameViewerPluginControllerId = 'game-viewer-plugin-controller';

export function registerGameViewer(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.services.module.registerUIModule({ moduleName: GameViewerPanelId, panels: [canvas]});

    registry.engine.onReady(() => {
        registry.engine.gizmos.showGizmo(AxisGizmoType);
        registry.engine.gizmos.setGizmoPosition(AxisGizmoType, new Point(2.5, 3.2));
    });
}

function createCanvas(registry: Registry): AbstractCanvasPanel<GameViewerModel> {
    const canvas = new Canvas3dPanel(registry, UI_Region.Canvas2, GameViewerPanelId, 'Game viewer');
    canvas.model = new GameViewerModel(registry);

    const tools = [
        new GameTool(canvas, registry),
        new CameraTool(canvas, registry)
    ];
    
    const controller = new GameViewerToolbarController(registry, canvas);
    canvas.setController(new FormController(canvas, registry, [], controller));
    canvas.setCamera(registry.engine.getCamera());
    canvas.renderer = new GameViewerRenderer(canvas, controller);
    tools.forEach(tool => canvas.addTool(tool));

    canvas.onMounted(() => {
        registry.engine.setup(document.querySelector(`#${GameViewerPanelId} canvas`));
        registry.engine.resize();
    
        canvas.getGizmos().forEach(gizmo => gizmo.mount());
    });

    canvas.onUnmounted(() => registry.engine.meshLoader.clear());

    return canvas;
}
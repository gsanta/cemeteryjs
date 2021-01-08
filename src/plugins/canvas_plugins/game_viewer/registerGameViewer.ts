

import { AbstractCanvasPanel } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { GizmoPlugin } from "../../../core/plugin/IGizmo";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { IKeyboardEvent } from "../../../core/services/input/KeyboardService";
import { AxisGizmo } from "../../canvas/gizmos/axis_gizmo/AxisGizmo";
import { onScreenCastGizmoKeyDown, ScreenCastKeysGizmoRenderer } from "../../canvas/gizmos/screencast_keys_gizmo/ScreenCastKeysGizmo";
import { GameViewerToolbarController } from "./controllers/GameViewerToolbarController";
import { GameTool } from "./controllers/tools/GameTool";
import { GameViewerRenderer } from "./renderers/GameViewerRenderer";
(<any> window).earcut = require('earcut');

export const GameViewerPanelId = 'game-viewer'; 
export const GameViewerPluginControllerId = 'game-viewer-plugin-controller';

export function registerGameViewer(registry: Registry) {
    const canvas = createCanvas(registry);
    // registerGizmos(canvas, registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function registerGizmos(canvas: AbstractCanvasPanel, registry: Registry) {
    const gizmo = new GizmoPlugin(registry, 100, 100);
        
    gizmo.onMount(() => {
        const axisGizmo = new AxisGizmo(canvas, registry);
        axisGizmo.mount();
    });

    canvas.addGizmo(gizmo);

    const screenCastGizmo = new GizmoPlugin(registry, 100, 100);

    gizmo.renderer = new ScreenCastKeysGizmoRenderer(gizmo);
    canvas.keyboard.onKeyDown((event: IKeyboardEvent) => {
        onScreenCastGizmoKeyDown(event, gizmo, canvas, registry);
    });

    canvas.addGizmo(screenCastGizmo);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas3dPanel(registry, UI_Region.Canvas2, GameViewerPanelId, 'Game viewer');

    const tools = [
        new GameTool(canvas, registry),
        new CameraTool(canvas, registry)
    ];
    
    const controller = new GameViewerToolbarController(registry);
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
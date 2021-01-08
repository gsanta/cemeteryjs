

import { Camera2D } from "../../../core/models/misc/camera/Camera2D";
import { NodeConnectionViewFactory, NodeConnectionView, NodeConnectionViewType } from "./models/views/NodeConnectionView";
import { AbstractCanvasPanel, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2dPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CommonToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { Point } from "../../../utils/geometry/shapes/Point";
import { NodeEditorRenderer } from "./renderers/NodeEditorRenderer";
import { JoinTool } from "./controllers/tools/JoinTool";
import { NodeEditorToolbarController } from "./controllers/NodeEditorToolbarController";

export const NodeEditorPanelId = 'node-editor'; 
export const NodeEditorToolControllerId = 'node-editor-tool-controller'; 

export function registerNodeEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas2dPanel(registry, UI_Region.Canvas1, NodeEditorPanelId, 'Node editor');

    const propControllers = [
        new ZoomInController(registry),
        new ZoomOutController(registry),
        new CommonToolController(registry)
    ];

    const tools = [
        new SelectTool(canvas, registry.data.view.node, registry),
        new DeleteTool(canvas, registry.data.view.node, registry),
        new CameraTool(canvas, registry),
        new JoinTool(canvas, registry.data.view.node, registry)
    ];

    const controller = new NodeEditorToolbarController(registry);

    canvas.setController(new FormController(canvas, registry, [], controller));
    canvas.setCamera(cameraInitializer(NodeEditorPanelId, registry));
    canvas.setViewStore(registry.data.view.node);
    canvas.renderer = new NodeEditorRenderer(registry, canvas, controller);
    tools.forEach(tool => canvas.addTool(tool));

    registry.data.view.node.registerViewType(NodeConnectionViewType, new NodeConnectionViewFactory());
    // registry.data.view.scene.registerViewType(MoveAxisViewType, () => new MoveAxisView(registry));
    // registry.data.view.scene.registerViewType(ScaleAxisViewType, () => new ScaleAxisView(registry));

    return canvas;
}

function getScreenSize(canvasId: string): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

function cameraInitializer(canvasId: string, registry: Registry) {
    const screenSize = getScreenSize(canvasId);
    if (screenSize) {
        return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new Camera2D(registry, new Point(100, 100));
    }
}



import { Camera2D } from "../../../core/models/misc/camera/Camera2D";
import { AbstractCanvasPanel, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2DPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CommonToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { Point } from "../../../utils/geometry/shapes/Point";
import { JoinTool } from "./tools/JoinTool";

export const NodeEditorPluginId = 'node-editor-plugin'; 
export const NodeEditorToolControllerId = 'node-editor-tool-controller'; 

export function registerNodeEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.plugins.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas2dPanel(registry, UI_Region.Canvas1, NodeEditorPluginId, 'Node editor');

    const propControllers = [
        new ZoomInController(),
        new ZoomOutController(),
        new CommonToolController()
    ];

    const tools = [
        new SelectTool(canvas, registry),
        new DeleteTool(canvas, registry),
        new CameraTool(canvas, registry),
        new JoinTool(canvas, registry)
    ];

    canvas.setController(new FormController(canvas, registry, propControllers));
    canvas.setCamera(cameraInitializer(NodeEditorPluginId, registry))
    tools.forEach(tool => canvas.addTool(tool));

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

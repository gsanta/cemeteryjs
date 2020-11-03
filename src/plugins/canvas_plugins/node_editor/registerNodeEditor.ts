

import { Camera2D } from "../../../core/models/misc/camera/Camera2D";
import { AbstractCanvasPlugin, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPlugin";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CommonToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { Registry } from "../../../core/Registry";
import { Point } from "../../../utils/geometry/shapes/Point";
import { NodeEditorPluginId } from "./NodeEditorPlugin";
import { JoinTool } from "./tools/JoinTool";

export function registerNodeEditor(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.plugins.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPlugin {
    const propControllers = [
        new ZoomInController(),
        new ZoomOutController(),
        new CommonToolController()
    ]

    const controller = new FormController(this, registry, propControllers);
    const camera = cameraInitializer(NodeEditorPluginId, registry);

    const canvas = new AbstractCanvasPlugin(registry, camera, this.region, NodeEditorPluginId, controller);

    const tools = [
        new SelectTool(this, registry),
        new DeleteTool(this, registry),
        new CameraTool(this, registry),
        new JoinTool(this, registry)
    ]

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

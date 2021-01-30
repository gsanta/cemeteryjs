

import { FormController } from "../../core/controller/FormController";
import { CommonToolController } from "../../core/controller/ToolController";
import { Camera2D } from "../../core/models/misc/camera/Camera2D";
import { AbstractCanvasPanel, ZoomInController, ZoomOutController } from "../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../core/plugin/Canvas2dPanel";
import { CameraTool } from "../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../core/plugin/UI_Panel";
import { Registry } from "../../core/Registry";
import { AbstractModuleExporter } from "../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../core/services/import/AbstractModuleImporter";
import { UIModule } from "../../core/services/ModuleService";
import { Point } from "../../utils/geometry/shapes/Point";
import { NodeEditorToolbarController } from "./main/controllers/NodeEditorToolbarController";
import { JoinTool } from "./main/controllers/tools/JoinTool";
import { NodeEditorExporter } from "./main/io/NodeEditorExporter";
import { NodeEditorImporter } from "./main/io/NodeEditorImporter";
import { NodeConnectionShapeFactory, NodeConnectionShapeType } from "./main/models/shapes/NodeConnectionShape";
import { NodeEditorRenderer } from "./main/renderers/NodeEditorRenderer";

export const NodeEditorPanelId = 'node-editor'; 
export const NodeEditorToolControllerId = 'node-editor-tool-controller';

export class NodeEditorModule extends Canvas2dPanel {

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas1, NodeEditorPanelId, 'Node editor');

        this.exporter = new NodeEditorExporter(registry);
        this.importer = new NodeEditorImporter(registry);

        const tools = [
            new SelectTool(this, registry.data.shape.node, registry),
            new DeleteTool(this, registry.data.shape.node, registry),
            new CameraTool(this, registry),
            new JoinTool(this, registry.data.shape.node, registry)
        ];
    
        const controller = new NodeEditorToolbarController(registry);
    
        this.setController(new FormController(this, registry, [], controller));
        this.setCamera(cameraInitializer(NodeEditorPanelId, registry));
        this.setViewStore(registry.data.shape.node);
        this.renderer = new NodeEditorRenderer(registry, this, controller);
        tools.forEach(tool => this.addTool(tool));
    
        registry.data.shape.node.registerViewType(NodeConnectionShapeType, new NodeConnectionShapeFactory());
    }
}


// export function registerNodeEditor(registry: Registry) {
//     const canvas = createCanvas(registry);

//     const module: UIModule = {
//         moduleName: NodeEditorPanelId,
//         panels: [canvas],
//         exporter: new NodeEditorExporter(registry),
//         importer: new NodeEditorImporter(registry)
//     }

//     registry.services.module.registerUIModule(module);

// }

// function createCanvas(registry: Registry): AbstractCanvasPanel {
//     const canvas = new Canvas2dPanel(registry, UI_Region.Canvas1, NodeEditorPanelId, 'Node editor');

//     const propControllers = [
//         new ZoomInController(registry),
//         new ZoomOutController(registry),
//         new CommonToolController(registry)
//     ];

//     const tools = [
//         new SelectTool(canvas, registry.data.shape.node, registry),
//         new DeleteTool(canvas, registry.data.shape.node, registry),
//         new CameraTool(canvas, registry),
//         new JoinTool(canvas, registry.data.shape.node, registry)
//     ];

//     const controller = new NodeEditorToolbarController(registry);

//     canvas.setController(new FormController(canvas, registry, [], controller));
//     canvas.setCamera(cameraInitializer(NodeEditorPanelId, registry));
//     canvas.setViewStore(registry.data.shape.node);
//     canvas.renderer = new NodeEditorRenderer(registry, canvas, controller);
//     tools.forEach(tool => canvas.addTool(tool));

//     registry.data.shape.node.registerViewType(NodeConnectionShapeType, new NodeConnectionShapeFactory());
//     // registry.data.view.scene.registerViewType(MoveAxisViewType, () => new MoveAxisView(registry));
//     // registry.data.view.scene.registerViewType(ScaleAxisViewType, () => new ScaleAxisView(registry));

//     return canvas;
// }

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

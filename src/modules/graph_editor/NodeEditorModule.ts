

import { FormController } from "../../core/controller/FormController";
import { ItemData } from "../../core/lookups/ItemData";
import { Camera2D } from "../../core/models/misc/camera/Camera2D";
import { AbstractShape } from "../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../core/plugin/Canvas2dPanel";
import { CameraTool } from "../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../core/plugin/tools/DeleteTool";
import { PointerToolLogicForSvgCanvas } from "../../core/plugin/tools/PointerTool";
import { SelectionToolLogicForSvgCanvas, SelectTool } from "../../core/plugin/tools/SelectTool";
import { UI_Region } from "../../core/plugin/UI_Panel";
import { Registry } from "../../core/Registry";
import { AbstractModuleExporter } from "../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../core/services/import/AbstractModuleImporter";
import { NodeGraphHook } from "../../core/services/NodePlugin";
import { SelectionStoreForNodeEditor } from "../../core/stores/SelectionStoreForNodeEditor";
import { ShapeLifeCycleHook, ShapeStore } from "../../core/stores/ShapeStore";
import { Point } from "../../utils/geometry/shapes/Point";
import { NodeEditorToolbarController } from "./main/controllers/NodeEditorToolbarController";
import { JoinTool } from "./main/controllers/tools/JoinTool";
import { NodeEditorExporter } from "./main/io/NodeEditorExporter";
import { NodeEditorImporter } from "./main/io/NodeEditorImporter";
import { NodeConnectionShapeFactory, NodeConnectionShapeType } from "./main/models/shapes/NodeConnectionShape";
import { NodeEditorRenderer } from "./main/renderers/NodeEditorRenderer";

export const NodeEditorPanelId = 'node-editor'; 
export const NodeEditorToolControllerId = 'node-editor-tool-controller';

export class NodeEditorModule extends Canvas2dPanel<AbstractShape> {

    data: ItemData<AbstractShape>

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas1, NodeEditorPanelId, 'Node editor');

        this.data = {
            items: ShapeStore.newInstance(registry, this),
            selection: new SelectionStoreForNodeEditor()
        }

        registry.data.node = this.data;
        (this.registry.data.node.items as ShapeStore).addHook(new ShapeLifeCycleHook(this.registry));
        (this.registry.data.node.items as ShapeStore).addHook(new NodeGraphHook(this.registry));

        this.exporter = new NodeEditorExporter(registry);
        this.importer = new NodeEditorImporter(registry);

        const tools = [
            new SelectTool(new PointerToolLogicForSvgCanvas(registry, this), new SelectionToolLogicForSvgCanvas(registry, this), this, registry),
            new DeleteTool(new PointerToolLogicForSvgCanvas(registry, this), this, registry),
            new CameraTool(this, registry),
            new JoinTool(new PointerToolLogicForSvgCanvas(registry, this), this, registry)
        ];
    
        const controller = new NodeEditorToolbarController(registry);
    
        this.setController(new FormController(this, registry, [], controller));
        this.setCamera(this.cameraInitializer(NodeEditorPanelId, registry));
        this.renderer = new NodeEditorRenderer(registry, this, controller);
        tools.forEach(tool => this.addTool(tool));
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

    private cameraInitializer(canvasId: string, registry: Registry) {
        const screenSize = this.getScreenSize(canvasId);
        if (screenSize) {
            return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
        } else {
            return new Camera2D(registry, new Point(100, 100));
        }
    }

}
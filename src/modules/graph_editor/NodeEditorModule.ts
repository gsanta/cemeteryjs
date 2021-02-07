

import { FormController } from "../../core/controller/FormController";
import { ItemData } from "../../core/data/ItemData";
import { Camera2D } from "../../core/models/misc/camera/Camera2D";
import { ShapeObservable } from "../../core/models/ShapeObservable";
import { AbstractShape } from "../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../core/models/modules/Canvas2dPanel";
import { CameraTool } from "../../core/controller/tools/CameraTool";
import { DeleteTool_Svg } from "../../core/controller/tools/DeleteTool_Svg";
import { PointerToolLogicForSvgCanvas } from "../../core/controller/tools/PointerTool";
import { SelectionToolLogicForSvgCanvas, SelectTool } from "../../core/controller/tools/SelectTool";
import { UI_Region } from "../../core/models/UI_Panel";
import { Registry } from "../../core/Registry";
import { AbstractModuleExporter } from "../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../core/services/import/AbstractModuleImporter";
import { NodeGraphHook } from "../../core/services/NodePlugin";
import { SelectionStoreForNodeEditor } from "../../core/data/stores/SelectionStoreForNodeEditor";
import { ShapeLifeCycleHook, ShapeStore } from "../../core/data/stores/ShapeStore";
import { Point } from "../../utils/geometry/shapes/Point";
import { NodeEditorToolbarController } from "./main/controllers/NodeEditorToolbarController";
import { JoinTool } from "./main/controllers/tools/JoinTool";
import { NodeEditorExporter } from "./main/io/NodeEditorExporter";
import { NodeEditorImporter } from "./main/io/NodeEditorImporter";
import { NodeConnectionShapeFactory, NodeConnectionShapeType } from "./main/models/shapes/NodeConnectionShape";
import { NodeEditorRenderer } from "./main/renderers/NodeEditorRenderer";
import { SelectTool_Svg } from "../../core/controller/tools/SelectTool_Svg";
import { TagStore } from "../../core/data/stores/TagStore";

export const NodeEditorPanelId = 'node-editor'; 
export const NodeEditorToolControllerId = 'node-editor-tool-controller';

export class NodeEditorModule extends Canvas2dPanel {

    data: ItemData<AbstractShape>

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;
    observable: ShapeObservable;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas1, NodeEditorPanelId, 'Node editor');

        this.data = {
            items: ShapeStore.newInstance(registry, this),
            selection: new SelectionStoreForNodeEditor(),
            tags: new TagStore()
        }

        this.observable = new ShapeObservable();

        registry.data.node = this.data;
        (this.registry.data.node.items as ShapeStore).addHook(new ShapeLifeCycleHook(this.registry));
        (this.registry.data.node.items as ShapeStore).addHook(new NodeGraphHook(this.registry));

        this.exporter = new NodeEditorExporter(registry);
        this.importer = new NodeEditorImporter(registry);

        const tools = [
            new SelectTool_Svg(this, registry),
            new DeleteTool_Svg(this, registry),
            new CameraTool(this, registry),
            new JoinTool(this, registry)
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
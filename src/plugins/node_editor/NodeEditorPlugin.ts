import { AbstractCanvasPlugin, calcOffsetFromDom } from '../../core/plugins/AbstractCanvasPlugin';
import { ToolType } from '../../core/plugins/tools/Tool';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, NodeModel } from '../../core/stores/game_objects/NodeModel';
import { NodeStore } from '../../core/stores/NodeStore';
import { UI_Layout } from '../../core/ui_regions/elements/UI_Layout';
import { UI_SvgCanvas } from '../../core/ui_regions/elements/UI_SvgCanvas';
import { Point } from '../../utils/geometry/shapes/Point';
import { Camera2D } from '../common/camera/Camera2D';
import { PluginSettings } from '../common/PluginSettings';
import { toolFactory } from '../common/toolbar/toolFactory';
import { NodeEditorExporter } from './io/NodeEditorExporter';
import { NodeEditorImporter } from './io/NodeEditorImporter';
import { NodeEditorController, NodeEditorControllerId, NodeEditorProps } from './NodeEditorController';
import { PathNodeElement } from './nodes/PathNodeElement';

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

export enum CanvasTag {
    Selected = 'selected',
    Hovered = 'hovered'
}

export const NodeEditorPluginId = 'action-editor-plugin'; 

export class NodeEditorPlugin extends AbstractCanvasPlugin {
    id = 'action-editor-plugin';
    region = UI_Region.Canvas1;

    nodeObjects: NodeModel;

    private camera: Camera2D;

    nodeTypes: string[] = [
        BuiltinNodeType.And,
        BuiltinNodeType.Animation,
        BuiltinNodeType.Keyboard,
        BuiltinNodeType.Mesh,
        BuiltinNodeType.Move,
        BuiltinNodeType.Split,
        BuiltinNodeType.Turn,
        BuiltinNodeType.Route,
        BuiltinNodeType.Path
    ];

    constructor(registry: Registry) {
        super(registry);

        [ToolType.Select, ToolType.Delete, ToolType.Camera, ToolType.Pointer, ToolType.Join, ToolType.DragAndDrop]
            .map(toolType => {
                this.toolHandler.registerTool(toolFactory(toolType, this, registry));
            });


        this.camera = cameraInitializer(NodeEditorPluginId, registry);

        this.controllers.set(NodeEditorControllerId, new NodeEditorController(this, this.registry));

        this.exporter = new NodeEditorExporter(this, this.registry);
        this.importer = new NodeEditorImporter(this, this.registry);

        this.registry.stores.nodeStore.presets
    }

    getStore(): NodeStore {
        return this.registry.stores.nodeStore;
    }

    resize(): void {
        const screenSize = getScreenSize(NodeEditorPluginId);
        screenSize && this.camera.resize(screenSize);

        this.renderFunc && this.renderFunc();
    };

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera() {
        return this.camera;
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.svgCanvas(null);

        const dropLayer = canvas.dropLayer({controllerId: NodeEditorControllerId, prop: NodeEditorProps.DropNode });
        dropLayer.acceptedDropIds = this.registry.services.node.nodeTypes
        dropLayer.isDragging = !!this.droppableId;

        const toolbar = canvas.toolbar();

        let tool = toolbar.tool({controllerId: ToolType.Select, key: ToolType.Select});
        tool.icon = 'select';
        let tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({controllerId: ToolType.Delete, key: ToolType.Delete});
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({controllerId: ToolType.Move, key: ToolType.Move});
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        tool = toolbar.tool({controllerId: ToolType.Camera, key: `zoom-in`});
        tool.icon = 'zoom-in';
        tooltip = tool.tooltip();
        tooltip.label = 'Zoom in';

        tool = toolbar.tool({controllerId: ToolType.Camera, key: `zoom-out`});
        tool.icon = 'zoom-out';
        tooltip = tool.tooltip();
        tooltip.label = 'Zoom out';

        this.renderNodesInto(canvas);
    }

    private renderNodesInto(canvas: UI_SvgCanvas) {
        this.registry.stores.nodeStore.getNodes()
            .forEach(node => {
                if (node.model.type === BuiltinNodeType.Path) {
                    new PathNodeElement(this, this.registry).renderInto(canvas, node);
                }
            })
    }

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Select);
        }
    }
}
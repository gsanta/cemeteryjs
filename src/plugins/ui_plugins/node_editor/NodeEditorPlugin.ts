import { BuiltinNodeType, NodeModel } from '../../../core/models/game_objects/NodeModel';
import { AbstractCanvasPlugin, calcOffsetFromDom } from '../../../core/plugins/AbstractCanvasPlugin';
import { CanvasControllerId, CanvasControllerProps } from '../../../core/plugins/controllers/CanvasController';
import { JoinTool } from '../../../core/plugins/tools/JoinTool';
import { ToolType } from '../../../core/plugins/tools/Tool';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { NodeStore } from '../../../core/stores/NodeStore';
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { Point } from '../../../utils/geometry/shapes/Point';
import { Camera2D } from '../../../core/models/misc/camera/Camera2D';
import { toolFactory } from '../../../core/plugins/tools/toolFactory';
import { NodeEditorExporter } from './io/NodeEditorExporter';
import { NodeEditorImporter } from './io/NodeEditorImporter';
import { NodeEditorController, NodeEditorControllerId, NodeEditorProps } from './NodeEditorController';

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
        const canvas = layout.svgCanvas({ controllerId: activeToolId });

        const dropLayer = canvas.dropLayer({controllerId: NodeEditorControllerId, prop: NodeEditorProps.DropNode });
        dropLayer.acceptedDropIds = this.registry.services.node.nodeTypes
        dropLayer.isDragging = !!this.dropItem;

        const toolbar = canvas.toolbar();

        let tool = toolbar.tool({controllerId: ToolType.Select, key: ToolType.Select});
        tool.icon = 'select';
        let tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({controllerId: ToolType.Delete, key: ToolType.Delete});
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({controllerId: ToolType.Camera, key: ToolType.Move});
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';
        
        let actionIcon = toolbar.actionIcon({controllerId: CanvasControllerId, prop: CanvasControllerProps.ZoomIn});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({controllerId: CanvasControllerId, prop: CanvasControllerProps.ZoomOut});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        const joinTool = <JoinTool> this.toolHandler.getById(ToolType.Join);

        if (joinTool.start && joinTool.end) {
            const line = canvas.line()
            line.x1 = joinTool.start.x;
            line.y1 = joinTool.start.y;
            line.x2 = joinTool.end.x;
            line.y2 = joinTool.end.y;
        }

        this.renderNodesInto(canvas);
        this.renderConnectionsInto(canvas);
    }

    private renderNodesInto(canvas: UI_SvgCanvas) {
        this.registry.stores.nodeStore.getNodes().forEach(node => this.registry.services.node.renderNodeInto(node, canvas))
    }

    private renderConnectionsInto(canvas: UI_SvgCanvas) {
        this.registry.stores.nodeStore.getConnections().forEach(connection => {
            const line = canvas.line()
            line.x1 = connection.joinPoint1.getAbsolutePosition().x;
            line.y1 = connection.joinPoint1.getAbsolutePosition().y;
            line.x2 = connection.joinPoint2.getAbsolutePosition().x;
            line.y2 = connection.joinPoint2.getAbsolutePosition().y;
        });
    }

    // dropItem(droppedItemId: string) {
    //     const dropItemId = (<NodeEditorPlugin> this.plugin).droppableId;
    //     this.registry.services.node.createNodeView(dropItemId, this.registry.services.pointer.pointer.curr);
    //     (<NodeEditorPlugin> this.plugin).droppableId = undefined;
    //     this.registry.services.render.reRender(UI_Region.Canvas1);
    // }

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Select);
        }
    }
}
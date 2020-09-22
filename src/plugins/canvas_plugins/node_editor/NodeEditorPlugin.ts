import { NodeObj } from '../../../core/models/objs/NodeObj';
import { Camera2D } from '../../../core/models/misc/camera/Camera2D';
import { NodeConnectionView } from '../../../core/models/views/NodeConnectionView';
import { NodeView } from '../../../core/models/views/NodeView';
import { ViewTag, ViewType } from '../../../core/models/views/View';
import { AbstractCanvasPlugin, calcOffsetFromDom } from '../../../core/plugin/AbstractCanvasPlugin';
import { CanvasControllerProps } from '../../../core/plugin/controller/CanvasController';
import { JoinTool } from './tools/JoinTool';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { ViewStore } from '../../../core/stores/ViewStore';
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { colors } from '../../../core/ui_components/react/styles';
import { Point } from '../../../utils/geometry/shapes/Point';
import { NodeEditorController, NodeEditorControllerId, NodeEditorProps } from './NodeEditorController';
import { SelectTool } from '../../../core/plugin/tools/SelectTool';
import { DeleteTool } from '../../../core/plugin/tools/DeleteTool';
import { CameraTool } from '../../../core/plugin/tools/CameraTool';
import { NodeEditorExporter } from './io/NodeEditorExporter';
import { NodeEditorImporter } from './io/NodeEditorImporter';

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

export const NodeEditorPluginId = 'node-editor-plugin'; 

export class NodeEditorPlugin extends AbstractCanvasPlugin {
    id = NodeEditorPluginId;
    region = UI_Region.Canvas1;

    nodeObjects: NodeObj;

    private camera: Camera2D;
    private nodeEditorController: NodeEditorController;

    constructor(registry: Registry) {
        super(registry);

        this.toolHandler.registerTool(new SelectTool(this, this.registry));
        this.toolHandler.registerTool(new DeleteTool(this, this.registry));
        this.toolHandler.registerTool(new CameraTool(this, this.registry));
        this.toolHandler.registerTool(new JoinTool(this, this.registry));

        this.nodeEditorController = new NodeEditorController(this, this.registry);
        this.camera = cameraInitializer(NodeEditorPluginId, registry);


        this.exporter = new NodeEditorExporter(this, this.registry);
        this.importer = new NodeEditorImporter(this, this.registry);

    }

    getStore(): ViewStore {
        return this.registry.stores.nodeStore;
    }

    resize(): void {
        const screenSize = getScreenSize(NodeEditorPluginId);
        screenSize && this.camera.resize(screenSize);

        this.registry.services.render.reRender(this.region);
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
        toolbar.controller = this.nodeEditorController;

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

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';
        
        let actionIcon = toolbar.actionIcon({prop: CanvasControllerProps.ZoomIn});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: CanvasControllerProps.ZoomOut});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        const joinTool = <JoinTool> this.toolHandler.getById(ToolType.Join);

        if (joinTool.startPoint && joinTool.endPoint) {
            const line = canvas.line()
            line.css = {
                pointerEvents: 'none',
                stroke: colors.grey4,
                strokeWidth: "3",
                strokeDasharray: "12 3"
            }
            line.x1 = joinTool.startPoint.x;
            line.y1 = joinTool.startPoint.y;
            line.x2 = joinTool.endPoint.x;
            line.y2 = joinTool.endPoint.y;
        }

        this.renderNodesInto(canvas);
        this.renderConnectionsInto(canvas);
    }

    private renderNodesInto(canvas: UI_SvgCanvas) {
        (<NodeView[]> this.registry.stores.nodeStore.getViewsByType(ViewType.NodeView)).forEach(node => this.registry.services.node.renderNodeInto(node, canvas))
    }

    private renderConnectionsInto(canvas: UI_SvgCanvas) {
        this.registry.stores.nodeStore.getViewsByType(ViewType.NodeConnectionView).forEach((connection: NodeConnectionView) => {
            const line = canvas.line();
            line.x1 = connection.point1.x;
            line.y1 = connection.point1.y;
            line.x2 = connection.point2.x;
            line.y2 = connection.point2.y;
            line.css = {
                pointerEvents: 'none',
                stroke: colors.grey4,
                strokeWidth: "3"
            }

            const line2 = canvas.line();
            line2.data = connection;
            line2.css = {
                stroke: connection.tags.has(ViewTag.Hovered) || connection.tags.has(ViewTag.Selected) ? colors.views.highlight : 'transparent',
                strokeWidth: "6"
            }
            line2.x1 = connection.point1.x;
            line2.y1 = connection.point1.y;
            line2.x2 = connection.point2.x;
            line2.y2 = connection.point2.y;
        });
    }

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Select);
        }
    }
}
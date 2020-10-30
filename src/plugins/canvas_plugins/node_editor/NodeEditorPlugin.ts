import { Camera2D } from '../../../core/models/misc/camera/Camera2D';
import { NodeConnectionView, NodeConnectionViewType } from '../../../core/models/views/NodeConnectionView';
import { NodeView, NodeViewType } from '../../../core/models/views/NodeView';
import { ViewTag } from '../../../core/models/views/View';
import { AbstractCanvasPlugin, ZoomInController, ZoomInProp, ZoomOutController, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { FormController } from '../../../core/plugin/controller/FormController';
import { CommonToolController, ToolController } from '../../../core/plugin/controller/ToolController';
import { CameraTool, CameraToolId } from '../../../core/plugin/tools/CameraTool';
import { DeleteTool, DeleteToolId } from '../../../core/plugin/tools/DeleteTool';
import { SelectTool, SelectToolId } from '../../../core/plugin/tools/SelectTool';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { UI_Model } from '../../../core/plugin/UI_Model';
import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { UI_Plugin } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { colors } from '../../../core/ui_components/react/styles';
import { Point } from '../../../utils/geometry/shapes/Point';
import { NodeRenderer } from './NodeRenderer';
import { JoinTool } from './tools/JoinTool';

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
export const NodeEditorToolControllerId = 'node-editor-tool-controller'; 

export class NodeEditorPlugin implements UI_Plugin {
    id: string = NodeEditorPluginId;
    region: UI_Region = UI_Region.Canvas1;
    displayName = 'Node editor';
    private panel: UI_Panel;
    private controller: FormController;
    private _toolController: ToolController;
    private model: UI_Model;
    private registry: Registry;
    private defaultNodeRenderer = new NodeRenderer();

    constructor(registry: Registry) {
        this.registry = registry;
        this.panel = new AbstractCanvasPlugin(registry, cameraInitializer(NodeEditorPluginId, registry), this.region, NodeEditorPluginId);

        const propControllers = [
            new ZoomInController(),
            new ZoomOutController(),
            new CommonToolController()
        ]

        this.controller = new FormController(this.panel, registry, propControllers);

        const tools = [
            new SelectTool(this.panel as AbstractCanvasPlugin, registry),
            new DeleteTool(this.panel as AbstractCanvasPlugin, registry),
            new CameraTool(this.panel as AbstractCanvasPlugin, registry),
            new JoinTool(this.panel as AbstractCanvasPlugin, registry)
        ]

        this._toolController = new ToolController(this.panel as AbstractCanvasPlugin, this.registry, tools);

        this.model = new UI_Model();
    }

    getPanel() {
        return this.panel;
    }

    getController() {
        return this.controller;
    }

    getToolController() {
        return this._toolController;
    }

    getModel() {
        return this.model;
    }

    renderInto(layout: UI_Layout) {
        const canvas = layout.svgCanvas();

        const dropLayer = canvas.dropLayer();
        dropLayer.acceptedDropIds = this.registry.services.node.nodeTypes
        dropLayer.isDragging = !!(this.panel as AbstractCanvasPlugin).dropItem;

        const toolbar = canvas.toolbar();
        const selectedTool = this.registry.plugins.getToolController(this.id).getSelectedTool();

        let tool = toolbar.tool({prop: SelectToolId});
        tool.icon = 'select';
        tool.isActive = selectedTool.id === SelectToolId;
        let tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({prop: DeleteToolId});
        tool.isActive = selectedTool.id === DeleteToolId;
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({prop: CameraToolId});
        tool.isActive = selectedTool.id === CameraToolId;
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';
        
        let actionIcon = toolbar.actionIcon({prop: ZoomInProp});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: ZoomOutProp});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        const joinTool = <JoinTool> this.registry.plugins.getToolController(this.id).getToolById(ToolType.Join);

        if (joinTool.startPoint && joinTool.endPoint) {
            const line = canvas.line()
            line.css = {
                pointerEvents: 'none',
                stroke: colors.grey1,
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
        (<NodeView[]> this.registry.stores.views.getViewsByType(NodeViewType)).forEach(nodeView => {
            this.defaultNodeRenderer.render(canvas, nodeView);
        });
    }

    private renderConnectionsInto(canvas: UI_SvgCanvas) {
        this.registry.stores.views.getViewsByType(NodeConnectionViewType).forEach((connection: NodeConnectionView) => {
            const line = canvas.line();
            line.x1 = connection.point1.x;
            line.y1 = connection.point1.y;
            line.x2 = connection.point2.x;
            line.y2 = connection.point2.y;
            line.css = {
                pointerEvents: 'none',
                stroke: colors.grey1,
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
}
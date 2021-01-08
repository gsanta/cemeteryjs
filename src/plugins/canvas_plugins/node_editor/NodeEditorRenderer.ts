import { NodeConnectionViewType, NodeConnectionView } from "./views/NodeConnectionView";
import { ViewTag } from "../../../core/models/views/View";
import { AbstractCanvasPanel, ZoomInProp, ZoomOutProp } from "../../../core/plugin/AbstractCanvasPanel";
import { ICanvasRenderer } from "../../../core/plugin/ICanvasRenderer";
import { CameraToolId } from "../../../core/plugin/tools/CameraTool";
import { DeleteToolId } from "../../../core/plugin/tools/DeleteTool";
import { SelectToolId } from "../../../core/plugin/tools/SelectTool";
import { ToolType } from "../../../core/plugin/tools/Tool";
import { Registry } from "../../../core/Registry";
import { UI_SvgCanvas } from "../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../core/ui_components/react/styles";
import { Point } from "../../../utils/geometry/shapes/Point";
import { JoinTool } from "./tools/JoinTool";
import { NodeView, NodeViewType } from "./views/NodeView";
import { NodeConnectionRenderer } from "./views/NodeConnectionRenderer";

export class NodeEditorRenderer implements ICanvasRenderer {
    private canvas: AbstractCanvasPanel;
    private registry: Registry;
    private nodeConnectionRenderer: NodeConnectionRenderer;

    constructor(registry: Registry, canvas: AbstractCanvasPanel) {
        this.canvas = canvas;
        this.registry = registry;
        this.nodeConnectionRenderer = new NodeConnectionRenderer(registry);
    }

    renderInto(svgCanvas: UI_SvgCanvas): void {
        const dropLayer = svgCanvas.dropLayer({});
        dropLayer.acceptedDropIds = this.registry.data.helper.node.getRegisteredNodeTypes();
        dropLayer.isDragging = !!this.registry.services.dragAndDropService.isDragging;

        const toolbar = svgCanvas.toolbar();
        const selectedTool = this.canvas.toolController.getSelectedTool();

        let tool = toolbar.tool({key: SelectToolId});
        tool.icon = 'select';
        tool.isActive = selectedTool.id === SelectToolId;
        let tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({key: DeleteToolId});
        tool.isActive = selectedTool.id === DeleteToolId;
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({key: CameraToolId});
        tool.isActive = selectedTool.id === CameraToolId;
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';
        
        let actionIcon = toolbar.actionIcon({key: ZoomInProp, uniqueId: `${this.canvas.id}-${ZoomInProp}`});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({key: ZoomOutProp, uniqueId: `${this.canvas.id}-${ZoomOutProp}`});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        const joinTool = <JoinTool> this.canvas.toolController.getToolById(ToolType.Join);

        if (joinTool.startPoint && joinTool.endPoint) {
            const line = svgCanvas.line()
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

        this.renderNodesInto(svgCanvas);
        this.nodeConnectionRenderer.renderInto(svgCanvas);
    }

    private renderNodesInto(canvas: UI_SvgCanvas) {
        (<NodeView[]> this.registry.data.view.node.getViewsByType(NodeViewType)).forEach(nodeView => {
            nodeView.renderer.renderInto(canvas, nodeView, this.canvas);
        });
    }
}
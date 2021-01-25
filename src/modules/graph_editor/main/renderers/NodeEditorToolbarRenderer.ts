import { AbstractCanvasPanel, ZoomInProp, ZoomOutProp } from "../../../../core/plugin/AbstractCanvasPanel";
import { IRenderer } from "../../../../core/plugin/IRenderer";
import { CameraToolId } from "../../../../core/plugin/tools/CameraTool";
import { DeleteToolId } from "../../../../core/plugin/tools/DeleteTool";
import { SelectToolId } from "../../../../core/plugin/tools/SelectTool";
import { Registry } from "../../../../core/Registry";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { NodeEditorToolbarController } from "../controllers/NodeEditorToolbarController";

export class NodeEditorToolbarRenderer implements IRenderer<UI_SvgCanvas> {
    private registry: Registry;
    private controller: NodeEditorToolbarController;
    private canvas: AbstractCanvasPanel;

    constructor(registry: Registry, canvas: AbstractCanvasPanel, controller: NodeEditorToolbarController) {
        this.registry = registry;
        this.canvas = canvas;
        this.controller = controller;
    }

    renderInto(svgCanvas: UI_SvgCanvas): void {
        const dropLayer = svgCanvas.dropLayer({});
        dropLayer.acceptedDropIds = this.registry.data.helper.node.getRegisteredNodeTypes();
        dropLayer.isDragging = !!this.registry.services.dragAndDropService.isDragging;

        const toolbar = svgCanvas.toolbar();
        const selectedTool = this.canvas.toolController.getSelectedTool();

        let tool = toolbar.tool({key: SelectToolId});
        tool.paramController = this.controller.commonTool; 
        tool.icon = 'select';
        tool.isActive = selectedTool.id === SelectToolId;
        let tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({key: DeleteToolId});
        tool.paramController = this.controller.commonTool; 
        tool.isActive = selectedTool.id === DeleteToolId;
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({key: CameraToolId});
        tool.paramController = this.controller.commonTool; 
        tool.isActive = selectedTool.id === CameraToolId;
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';
        
        let actionIcon = toolbar.actionIcon({key: ZoomInProp, uniqueId: `${this.canvas.id}-${ZoomInProp}`});
        tool.paramController = this.controller.zoomIn; 
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({key: ZoomOutProp, uniqueId: `${this.canvas.id}-${ZoomOutProp}`});
        tool.paramController = this.controller.zoomOut; 
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';
    }
}
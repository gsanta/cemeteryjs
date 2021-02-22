import { CameraToolId } from "../../../../core/controller/tools/CameraTool";
import { DeleteToolId } from "../../../../core/controller/tools/DeleteTool_Svg";
import { SelectToolId } from "../../../../core/controller/tools/SelectTool_Svg";
import { IRenderer } from "../../../../core/models/IRenderer";
import { ZoomInProp, ZoomOutProp } from "../../../../core/models/modules/AbstractCanvasPanel";
import { Registry } from "../../../../core/Registry";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { NodeEditorModule } from "../../NodeEditorModule";
import { NodeEditorToolbarController } from "../controllers/NodeEditorToolbarController";

export class NodeEditorToolbarRenderer implements IRenderer<UI_SvgCanvas> {
    private registry: Registry;
    private controller: NodeEditorToolbarController;
    private canvas: NodeEditorModule;

    constructor(registry: Registry, canvas: NodeEditorModule, controller: NodeEditorToolbarController) {
        this.registry = registry;
        this.canvas = canvas;
        this.controller = controller;
    }

    renderInto(svgCanvas: UI_SvgCanvas): void {
        const dropLayer = svgCanvas.dropLayer({});
        dropLayer.acceptedDropIds = this.registry.data.helper.node.getRegisteredNodeTypes();
        dropLayer.isDragging = !!this.registry.services.dragAndDropService.isDragging;

        const toolbar = svgCanvas.toolbar();
        const selectedTool = this.canvas.tool.getSelectedTool();

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
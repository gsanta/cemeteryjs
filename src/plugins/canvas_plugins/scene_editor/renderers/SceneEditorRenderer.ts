import { sortViewsByLayer, AbstractShape } from "../../../../core/models/views/AbstractShape";
import { AbstractCanvasPanel, RedoProp, UndoProp, ZoomInProp, ZoomOutProp } from "../../../../core/plugin/AbstractCanvasPanel";
import { ICanvasRenderer } from "../../../../core/plugin/ICanvasRenderer";
import { CameraToolId } from "../../../../core/plugin/tools/CameraTool";
import { DeleteToolId } from "../../../../core/plugin/tools/DeleteTool";
import { SelectToolId } from "../../../../core/plugin/tools/SelectTool";
import { Registry } from "../../../../core/Registry";
import { UI_Toolbar } from "../../../../core/ui_components/elements/toolbar/UI_Toolbar";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { MoveAxisToolId } from "../controllers/tools/MoveAxisTool";
import { RotateAxisToolId } from "../controllers/tools/RotateAxisTool";
import { ScaleAxisToolId } from "../controllers/tools/ScaleAxisTool";
import { SceneEditorToolbarProps } from "../controllers/SceneEditorToolbarController";
import { CubeToolId } from "../controllers/tools/CubeTool";
import { GroundToolId } from "../controllers/tools/GroundTool";
import { LightToolId } from "../controllers/tools/LightTool";
import { MeshToolId } from "../controllers/tools/MeshTool";
import { PathToolId } from "../controllers/tools/PathTool";
import { SphereToolId } from "../controllers/tools/SphereTool";
import { SpriteToolId } from "../controllers/tools/SpriteTool";

export class SceneEditorRenderer implements ICanvasRenderer {
    private canvas: AbstractCanvasPanel;
    private registry: Registry;

    // TODO: temporary fields, should be in UI_Model
    activeShapeToolId: string = CubeToolId;
    isShapeDropdownOpen = false;

    constructor(registry: Registry, canvas: AbstractCanvasPanel) {
        this.canvas = canvas;
        this.registry = registry;
    }

    renderInto(uiSvgCanvas: UI_SvgCanvas) {
        const toolbar = uiSvgCanvas.toolbar();

        let tool = toolbar.tool({key: MeshToolId});
        tool.uniqueId = `${MeshToolId}-${this.canvas.id}`;
        tool.icon = 'mesh';
        tool.isActive = this.canvas.toolController.getToolById(MeshToolId).isSelected;
        let tooltip = tool.tooltip();
        tooltip.label = 'Add Mesh';

        tool = toolbar.tool({key: SpriteToolId});
        tool.uniqueId = `${SpriteToolId}-${this.canvas.id}`;
        tool.icon = 'sprite';
        tool.isActive = this.canvas.toolController.getToolById(SpriteToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Add Sprite';

        tool = toolbar.tool({key: LightToolId});
        tool.uniqueId = `${LightToolId}-${this.canvas.id}`;
        tool.icon = 'light';
        tool.isActive = this.canvas.toolController.getToolById(LightToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Add Light';

        this.renderShapeDropdown(toolbar);
        
        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool({key: PathToolId});
        tool.uniqueId = `${PathToolId}-${this.canvas.id}`;
        tool.icon = 'path';
        tool.isActive = this.canvas.toolController.getToolById(PathToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Path tool';

        tool = toolbar.tool({key: SelectToolId});
        tool.uniqueId = `${SelectToolId}-${this.canvas.id}`;
        tool.icon = 'select';
        tool.isActive = this.canvas.toolController.getToolById(SelectToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({key: DeleteToolId});
        tool.uniqueId = `${DeleteToolId}-${this.canvas.id}`;
        tool.icon = 'delete';
        tool.isActive = this.canvas.toolController.getToolById(DeleteToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({key: CameraToolId});
        tool.uniqueId = `${CameraToolId}-${this.canvas.id}`;
        tool.icon = 'pan';
        tool.isActive = this.canvas.toolController.getToolById(CameraToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({key: ZoomInProp, uniqueId: `${ZoomInProp}-${this.canvas.id}`});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({key: ZoomOutProp, uniqueId: `${ZoomOutProp}-${this.canvas.id}`});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({key: MoveAxisToolId, uniqueId: `${MoveAxisToolId}-${this.canvas.id}`});
        actionIcon.icon = 'move';
        actionIcon.isActivated = this.canvas.toolController.getToolById(MoveAxisToolId).isSelected;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Move';

        actionIcon = toolbar.actionIcon({key: RotateAxisToolId, uniqueId: `${RotateAxisToolId}-${this.canvas.id}`});
        actionIcon.icon = 'rotate';
        actionIcon.isActivated = this.canvas.toolController.getToolById(RotateAxisToolId).isSelected;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Rotate';

        actionIcon = toolbar.actionIcon({key: ScaleAxisToolId, uniqueId: `${ScaleAxisToolId}-${this.canvas.id}`});
        actionIcon.icon = 'scale';
        actionIcon.isActivated = this.canvas.toolController.getToolById(ScaleAxisToolId).isSelected;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Scale';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({key: UndoProp, uniqueId: `${UndoProp}-${this.canvas.id}`});
        actionIcon.icon = 'undo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Undo';

        actionIcon = toolbar.actionIcon({key: RedoProp, uniqueId: `${RedoProp}-${this.canvas.id}`});
        actionIcon.icon = 'redo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Redo';

        const views = this.registry.data.shape.scene.getAllShapes();

        sortViewsByLayer(views);

        this.renderViews(uiSvgCanvas, views);
    }

    private renderViews(canvas: UI_SvgCanvas, views: AbstractShape[]) {
        views.forEach(view => {
            view.renderer.renderInto(canvas, view, canvas.canvasPanel);
            view.containedViews.forEach(child => child.renderer && child.renderer.renderInto(canvas, child, canvas.canvasPanel));
        });
    }

    private renderShapeDropdown(toolbar: UI_Toolbar) {
        const toolController = this.canvas.toolController;

        let toolbarDropdown = toolbar.toolbarDropdown({ key: SceneEditorToolbarProps.SelectPrimitiveShape });
        const toolbarDropdownHeader = toolbarDropdown.header({ key: SceneEditorToolbarProps.OpenDropdown });
        
        let tool = toolController.getToolById(this.activeShapeToolId);
        let shapeTool = toolbarDropdownHeader.tool({key: this.activeShapeToolId});
        shapeTool.uniqueId = 'shape-tools';
        shapeTool.isActive = this.canvas.toolController.getToolById(this.activeShapeToolId).isSelected;
        shapeTool.icon = tool.icon;
        let tooltip = shapeTool.tooltip();
        tooltip.label = `Geometry tool`;

        if (this.isShapeDropdownOpen) {
            tool = toolController.getToolById(CubeToolId);
            shapeTool = toolbarDropdown.tool({key: CubeToolId});
            shapeTool.uniqueId = `${CubeToolId}-${this.canvas.id}`;
            shapeTool.icon = tool.icon;
            tooltip = shapeTool.tooltip();
            tooltip.label = `${tool.displayName} tool`;

            tool = toolController.getToolById(SphereToolId);
            shapeTool = toolbarDropdown.tool({key: SphereToolId});
            shapeTool.uniqueId = `${SphereToolId}-${this.canvas.id}`;
            shapeTool.icon = tool.icon;
            tooltip = shapeTool.tooltip();
            tooltip.label = `${tool.displayName} tool`;

            tool = toolController.getToolById(GroundToolId);
            shapeTool = toolbarDropdown.tool({key: GroundToolId});
            shapeTool.uniqueId = `${GroundToolId}-${this.canvas.id}`;
            shapeTool.icon = tool.icon;
            tooltip = shapeTool.tooltip();
            tooltip.label = `${tool.displayName} tool`;
        }
    }
}
import { InteractionMode, ZoomInProp, ZoomOutProp } from "../../../../core/models/modules/AbstractCanvasPanel";
import { ICanvasRenderer } from "../../../../core/models/ICanvasRenderer";
import { CameraToolId } from "../../../../core/controller/tools/CameraTool";
import { SelectToolId } from "../../../../core/controller/tools/SelectTool";
import { UI_HtmlCanvas } from "../../../../core/ui_components/elements/UI_HtmlCanvas";
import { GameViewerProps, SceneEditorToolbarController } from "../../contribs/toolbar/SceneEditorToolbarController";
import { SceneEditorModule } from "../SceneEditorModule";
import { GizmoType } from "../GizmoHandler";
import { UI_Toolbar } from "../../../../core/ui_components/elements/toolbar/UI_Toolbar";

export class SceneEditorRenderer implements ICanvasRenderer {
    private canvas: SceneEditorModule;
    private controllers: SceneEditorToolbarController;

    constructor(canvas: SceneEditorModule, controllers: SceneEditorToolbarController) {
        this.canvas = canvas;
        this.controllers = controllers;
    }

    renderInto(htmlCanvas: UI_HtmlCanvas): void { 
        const selectedTool = this.canvas.tool.getSelectedTool();

        const toolbar = htmlCanvas.toolbar();

        this.renderShapeDropdown(toolbar);

        let separator = toolbar.iconSeparator();

        let tool = toolbar.tool({key: CameraToolId});
        tool.paramController = this.controllers.commonTool;
        tool.isActive = selectedTool.id === CameraToolId;
        tool.uniqueId = `${CameraToolId}-${this.canvas.id}`;
        tool.icon = 'pan';
        let tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({key: ZoomInProp, uniqueId: `${ZoomInProp}-${this.canvas.id}`});
        actionIcon.paramController = this.controllers.zoomIn;
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({key: ZoomOutProp, uniqueId: `${ZoomOutProp}-${this.canvas.id}`});
        actionIcon.paramController = this.controllers.zoomOut;
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({key: 'undo', uniqueId: `undo-${this.canvas.id}`});
        actionIcon.icon = 'undo';
        actionIcon.paramController = this.controllers.undo;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Undo';

        actionIcon = toolbar.actionIcon({key: 'redo', uniqueId: `redo-${this.canvas.id}`});
        actionIcon.icon = 'redo';
        actionIcon.paramController = this.controllers.redo;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Redo';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool({key: SelectToolId});
        tool.uniqueId = `${SelectToolId}-${this.canvas.id}`;
        tool.icon = 'select';
        tool.isActive = this.canvas.tool.getToolById(SelectToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({key: GameViewerProps.ShowBoundingBoxes, uniqueId: `${GameViewerProps.ShowBoundingBoxes}-${this.canvas.id}` });
        actionIcon.icon = 'b';
        actionIcon.paramController = this.controllers.showBoundingBox;
        actionIcon.isActivated = this.canvas.showBoundingBoxes;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Show bounding boxes';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({key: 'move', uniqueId: `${'move'}-${this.canvas.id}`});
        actionIcon.icon = 'move';
        actionIcon.paramController = this.controllers.positionGizmo;
        actionIcon.isActivated = this.canvas.gizmoHandler.getSelectedGizmo() === GizmoType.Position;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Move';

        actionIcon = toolbar.actionIcon({key: 'rotate', uniqueId: `${'rotate'}-${this.canvas.id}`});
        actionIcon.icon = 'rotate';
        actionIcon.paramController = this.controllers.rotationGizmo;
        actionIcon.isActivated = this.canvas.gizmoHandler.getSelectedGizmo() === GizmoType.Rotation;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Rotate';

        actionIcon = toolbar.actionIcon({key: 'scale', uniqueId: `${'scale'}-${this.canvas.id}`});
        actionIcon.icon = 'scale';
        actionIcon.paramController = this.controllers.scaleGizmo;
        actionIcon.isActivated = this.canvas.gizmoHandler.getSelectedGizmo() === GizmoType.Scale;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Scale';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool({key: GameViewerProps.EditMode});
        tool.paramController = this.controllers.editMode;
        tool.uniqueId = `${GameViewerProps.EditMode}-${this.canvas.id}`;
        tool.isActive = this.canvas.interactionMode === InteractionMode.Edit;
        tool.icon = 'edit-mode';
        tool.placement = 'left';
        tooltip = tool.tooltip();
        tooltip.label = 'Edit mode';

        tool = toolbar.tool({key: GameViewerProps.ExecutionMode});
        tool.paramController = this.controllers.interactionMode;
        tool.uniqueId = `${GameViewerProps.ExecutionMode}-${this.canvas.id}`;
        tool.isActive = this.canvas.interactionMode === InteractionMode.Execution;
        tool.icon = 'games';
        tool.placement = 'left';
        tooltip = tool.tooltip();
        tooltip.label = 'Game mode';

        separator = toolbar.iconSeparator();
        separator.placement = 'middle';

        const gizmoLayer = htmlCanvas.gizmoLayer({});
        
        // this.canvas.getGizmos().forEach(gizmo => gizmo.renderer.renderInto(gizmoLayer));
    }

    private renderShapeDropdown(toolbar: UI_Toolbar) {
        const layoutSelect = toolbar.select({key: 'Add'});
        layoutSelect.paramController = this.controllers.add; 
        layoutSelect.layout = 'horizontal';
        layoutSelect.placeholder = 'Add';
        layoutSelect.inputWidth = '30px';
    }
}
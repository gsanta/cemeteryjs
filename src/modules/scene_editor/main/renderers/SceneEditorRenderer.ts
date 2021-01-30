import { _3DMoveTool } from "../../../../core/engine/adapters/babylonjs/tools/Bab_MoveTool";
import { _3DRotationTool } from "../../../../core/engine/adapters/babylonjs/tools/Bab_RotationTool";
import { _3DScaleTool } from "../../../../core/engine/adapters/babylonjs/tools/Bab_ScaleTool";
import { InteractionMode, ZoomInProp, ZoomOutProp } from "../../../../core/plugin/AbstractCanvasPanel";
import { ICanvasRenderer } from "../../../../core/plugin/ICanvasRenderer";
import { CameraToolId } from "../../../../core/plugin/tools/CameraTool";
import { UI_HtmlCanvas } from "../../../../core/ui_components/elements/UI_HtmlCanvas";
import { GameViewerProps, SceneEditorToolbarController } from "../../contribs/toolbar/SceneEditorToolbarController";
import { SceneEditorModule } from "../SceneEditorModule";

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

        let tool = toolbar.tool({key: CameraToolId});
        tool.paramController = this.controllers.commonTool;
        tool.isActive = selectedTool.id === CameraToolId;
        tool.uniqueId = `${CameraToolId}-${this.canvas.id}`;
        tool.icon = 'pan';
        let tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
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
        actionIcon.paramController = this.controllers.moveTool;
        actionIcon.isActivated = this.canvas.selectedTool === _3DMoveTool;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Move';

        actionIcon = toolbar.actionIcon({key: 'rotate', uniqueId: `${'rotate'}-${this.canvas.id}`});
        actionIcon.icon = 'rotate';
        actionIcon.paramController = this.controllers.rotationTool;
        actionIcon.isActivated = this.canvas.selectedTool === _3DRotationTool;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Rotate';

        actionIcon = toolbar.actionIcon({key: 'scale', uniqueId: `${'scale'}-${this.canvas.id}`});
        actionIcon.icon = 'scale';
        actionIcon.paramController = this.controllers.scaleTool;
        actionIcon.isActivated = this.canvas.selectedTool === _3DScaleTool;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Scale';

        tool = toolbar.tool({key: GameViewerProps.EditMode});
        tool.paramController = this.controllers.editMode;
        tool.uniqueId = `${GameViewerProps.EditMode}-${this.canvas.id}`;
        tool.isActive = this.canvas.interactionMode === InteractionMode.Edit;
        tool.icon = 'edit-mode';
        tool.placement = 'middle';
        tooltip = tool.tooltip();
        tooltip.label = 'Edit mode';

        tool = toolbar.tool({key: GameViewerProps.ExecutionMode});
        tool.paramController = this.controllers.interactionMode;
        tool.uniqueId = `${GameViewerProps.ExecutionMode}-${this.canvas.id}`;
        tool.isActive = this.canvas.interactionMode === InteractionMode.Execution;
        tool.icon = 'games';
        tool.placement = 'middle';
        tooltip = tool.tooltip();
        tooltip.label = 'Game mode';

        separator = toolbar.iconSeparator();
        separator.placement = 'middle';

        const gizmoLayer = htmlCanvas.gizmoLayer({});
        
        // this.canvas.getGizmos().forEach(gizmo => gizmo.renderer.renderInto(gizmoLayer));
    }
}
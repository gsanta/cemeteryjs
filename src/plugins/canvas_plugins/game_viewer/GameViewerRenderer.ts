import { AbstractCanvasPanel, InteractionMode, ZoomInProp, ZoomOutProp } from "../../../core/plugin/AbstractCanvasPanel";
import { ICanvasRenderer } from "../../../core/plugin/ICanvasRenderer";
import { CameraToolId } from "../../../core/plugin/tools/CameraTool";
import { Registry } from "../../../core/Registry";
import { UI_HtmlCanvas } from "../../../core/ui_components/elements/UI_HtmlCanvas";
import { GameViewerProps } from "./GameViewerProps";

export class GameViewerRenderer implements ICanvasRenderer {
    private canvas: AbstractCanvasPanel;
    private registry: Registry;

    constructor(registry: Registry, canvas: AbstractCanvasPanel) {
        this.canvas = canvas;
        this.registry = registry;
    }

    renderInto(htmlCanvas: UI_HtmlCanvas): void { 
        const selectedTool = this.canvas.toolController.getSelectedTool();

        const toolbar = htmlCanvas.toolbar();

        let tool = toolbar.tool({key: CameraToolId});
        tool.isActive = selectedTool.id === CameraToolId;
        tool.uniqueId = `${CameraToolId}-${this.canvas.id}`;
        tool.icon = 'pan';
        let tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

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

        tool = toolbar.tool({key: GameViewerProps.EditMode});
        tool.uniqueId = `${GameViewerProps.EditMode}-${this.canvas.id}`;
        tool.isActive = this.canvas.interactionMode === InteractionMode.Edit;
        tool.icon = 'edit-mode';
        tool.placement = 'middle';
        tooltip = tool.tooltip();
        tooltip.label = 'Edit mode';

        tool = toolbar.tool({key: GameViewerProps.ExecutionMode});
        tool.uniqueId = `${GameViewerProps.ExecutionMode}-${this.canvas.id}`;
        tool.isActive = this.canvas.interactionMode === InteractionMode.Execution;
        tool.icon = 'games';
        tool.placement = 'middle';
        tooltip = tool.tooltip();
        tooltip.label = 'Game mode';

        separator = toolbar.iconSeparator();
        separator.placement = 'middle';

        actionIcon = toolbar.actionIcon({key: GameViewerProps.Play, uniqueId: `${GameViewerProps.Play}-${this.canvas.id}`});
        actionIcon.icon = 'play';
        actionIcon.placement = 'middle';
        actionIcon.isActivated = this.registry.stores.game.gameState === 'running';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Play';

        actionIcon = toolbar.actionIcon({key: GameViewerProps.Stop, uniqueId: `${GameViewerProps.Stop}-${this.canvas.id}`});
        actionIcon.icon = 'stop';
        actionIcon.placement = 'middle';
        actionIcon.isActivated = this.registry.stores.game.gameState === 'paused';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Stop';


        const gizmoLayer = htmlCanvas.gizmoLayer({});
        
        // this.canvas.getGizmos().forEach(gizmo => gizmo.renderer.renderInto(gizmoLayer));
    }
}
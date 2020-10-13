import { MeshViewType } from '../../../core/models/views/MeshView';
import { PathViewType } from '../../../core/models/views/PathView';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { sortViewsByLayer, View } from '../../../core/models/views/View';
import { RedoProp, UndoProp, ZoomInProp, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { Canvas_2d_Plugin } from '../../../core/plugin/Canvas_2d_Plugin';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    viewTypes: string[] = [MeshViewType, PathViewType, SpriteViewType];

    constructor(registry: Registry) {
        super(SceneEditorPluginId, registry);
    }

    getStore() {
        return this.registry.stores.viewStore;
    }

    destroy() { 
        this.registry.stores.viewStore.clearSelection();
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.svgCanvas();

        const toolbar = canvas.toolbar();
        
        let tool = toolbar.tool(ToolType.Rectangle);
        tool.icon = 'mesh';
        let tooltip = tool.tooltip();
        tooltip.label = 'Add Mesh';

        tool = toolbar.tool(ToolType.Sprite);
        tool.icon = 'sprite';
        tooltip = tool.tooltip();
        tooltip.label = 'Add Sprite';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool(ToolType.Path);
        tool.icon = 'path';
        tooltip = tool.tooltip();
        tooltip.label = 'Path tool';

        tool = toolbar.tool(ToolType.Select);
        tool.icon = 'select';
        tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool(ToolType.Delete);
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool(ToolType.Camera);
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({prop: ZoomInProp});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: ZoomOutProp});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({prop: UndoProp});
        actionIcon.icon = 'undo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Undo';

        actionIcon = toolbar.actionIcon({prop: RedoProp});
        actionIcon.icon = 'redo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Redo';

        const views = [
            ...this.registry.stores.viewStore.getViewsByType(SpriteViewType),
            ...this.registry.stores.viewStore.getViewsByType(MeshViewType),
            ...this.registry.stores.viewStore.getViewsByType(PathViewType)
        ];

        sortViewsByLayer(views);

        this.renderViews(canvas, views);
    }

    private renderViews(canvas: UI_SvgCanvas, views: View[]) {
        views.forEach(view => {
            this.registry.services.viewService.renderInto(canvas, view);
            view.children.forEach(child => this.registry.services.viewService.renderInto(canvas, child));
        });
    }
}
import { CanvasControllerId, CanvasControllerProps } from '../../../core/plugins/controllers/CanvasController';
import { toDegree } from '../../../utils/geometry/Measurements';
import { colors } from '../../../core/ui_components/react/styles';
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { ViewTag } from '../../../core/models/views/View';
import { Canvas_2d_Plugin } from '../../../core/plugins/Canvas_2d_Plugin';
import { Registry } from '../../../core/Registry';
import { toolFactory } from '../../../core/plugins/tools/toolFactory';
import { ToolType } from '../../../core/plugins/tools/Tool';
import { sort } from '../../../utils/geometry/Functions';
import { SceneEditorExporter } from './io/SceneEditorExporter';
import { SceneEditorImporter } from './io/SceneEditorImporter';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    constructor(registry: Registry) {
        super(SceneEditorPluginId, registry);
        
        [ToolType.Rectangle, ToolType.Path, ToolType.Select, ToolType.Delete, ToolType.Pointer, ToolType.Camera]
            .map(toolType => {
                this.toolHandler.registerTool(toolFactory(toolType, this, registry));
            });

        this.exporter = new SceneEditorExporter(this, this.registry);
        this.importer = new SceneEditorImporter(this, this.registry);
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    destroy() { 
        this.registry.stores.selectionStore.clear();
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.svgCanvas({controllerId: activeToolId});

        const toolbar = canvas.toolbar();
        
        let tool = toolbar.tool({controllerId: ToolType.Rectangle, key: ToolType.Rectangle});
        tool.icon = 'brush';

        tool = toolbar.tool({controllerId: ToolType.Path, key: ToolType.Path});
        tool.icon = 'path';
        let tooltip = tool.tooltip();
        tooltip.label = 'Path tool';

        tool = toolbar.tool({controllerId: ToolType.Select, key: ToolType.Select});
        tool.icon = 'select';
        tooltip = tool.tooltip();
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

        let actionIcon = toolbar.actionIcon({controllerId: CanvasControllerId, prop: CanvasControllerProps.ZoomIn});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({controllerId: CanvasControllerId, prop: CanvasControllerProps.ZoomOut});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({controllerId: CanvasControllerId, prop: CanvasControllerProps.Undo});
        actionIcon.icon = 'undo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Undo';

        actionIcon = toolbar.actionIcon({controllerId: CanvasControllerId, prop: CanvasControllerProps.Redo});
        actionIcon.icon = 'redo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Redo';

        this.renderMeshViews(canvas);
        this.renderPathViews(canvas);
    }

    private renderMeshViews(canvas: UI_SvgCanvas) {
        const views = getSortedMeshViews(this.registry).map(item => {
            const group = canvas.group(item.id);
            group.data = item;
            group.transform = `translate(${item.dimensions.topLeft.x} ${item.dimensions.topLeft.y}) rotate(${toDegree(item.getRotation())} ${item.dimensions.getWidth() / 2} ${item.dimensions.getHeight() / 2})`;
            const rect = group.rect();
            rect.width = item.dimensions.getWidth();
            rect.height = item.dimensions.getHeight();

            rect.strokeColor = item.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';

            let thumbnail: JSX.Element = null;
            const thumbnailModel = this.registry.stores.assetStore.getAssetById(item.thumbnailId);
    
            if (thumbnailModel && thumbnailModel.data) {
                const image = group.image();
                image.href = thumbnailModel.data;
                image.width = item.dimensions.getWidth();
                image.height = item.dimensions.getHeight();
            }
    
            return thumbnail;
        });
    }

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Rectangle);
        }
    }

    private renderPathViews(canvas: UI_SvgCanvas) {

    }
}

function getSortedMeshViews(registry: Registry) {
    let items = [...registry.stores.canvasStore.getMeshViews()];
    return sort(items, (a, b) => a.layer - b.layer);
}
import { CanvasControllerId, CanvasControllerProps } from '../../../core/plugins/controllers/CanvasController';
import { toDegree } from '../../../utils/geometry/Measurements';
import { colors } from '../../../core/ui_components/react/styles';
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { ViewTag, ViewType } from '../../../core/models/views/View';
import { Canvas_2d_Plugin } from '../../../core/plugins/Canvas_2d_Plugin';
import { Registry } from '../../../core/Registry';
import { toolFactory } from '../../../core/plugins/tools/toolFactory';
import { ToolType } from '../../../core/plugins/tools/Tool';
import { sort } from '../../../utils/geometry/Functions';
import { SceneEditorExporter } from './io/SceneEditorExporter';
import { SceneEditorImporter } from './io/SceneEditorImporter';
import { MeshAddTool } from './tools/MeshAddTool';
import { SpriteAddTool } from './tools/SpriteAddTool';
import { SpriteViewType } from '../../../core/models/views/SpriteView';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    viewTypes: string[] = [ViewType.MeshView, ViewType.PathView, SpriteViewType];

    constructor(registry: Registry) {
        super(SceneEditorPluginId, registry);

        this.toolHandler.registerTool(new MeshAddTool(this, this.registry));
        this.toolHandler.registerTool(new SpriteAddTool(this, this.registry));
        
        [ToolType.Path, ToolType.Select, ToolType.Delete, ToolType.Pointer, ToolType.Camera]
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
        tool.icon = 'mesh';
        let tooltip = tool.tooltip();
        tooltip.label = 'Add Mesh';

        tool = toolbar.tool({controllerId: ToolType.Sprite, key: ToolType.Sprite});
        tool.icon = 'sprite';
        tooltip = tool.tooltip();
        tooltip.label = 'Add Sprite';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool({controllerId: ToolType.Path, key: ToolType.Path});
        tool.icon = 'path';
        tooltip = tool.tooltip();
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

        separator = toolbar.iconSeparator();
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
        this.renderSpriteViews(canvas);
        this.renderPathViews(canvas);
    }

    private renderMeshViews(canvas: UI_SvgCanvas) {
        const views = getSortedMeshViews(this.registry).map(meshView => {
            const group = canvas.group(meshView.id);
            group.data = meshView;
            group.transform = `translate(${meshView.dimensions.topLeft.x} ${meshView.dimensions.topLeft.y}) rotate(${toDegree(meshView.getRotation())} ${meshView.dimensions.getWidth() / 2} ${meshView.dimensions.getHeight() / 2})`;
            const rect = group.rect();
            rect.width = meshView.dimensions.getWidth();
            rect.height = meshView.dimensions.getHeight();

            rect.strokeColor = meshView.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';

            let thumbnail: JSX.Element = null;
    
            if (meshView.thumbnailData) {
                const image = group.image();
                image.href = meshView.thumbnailData;
                image.width = meshView.dimensions.getWidth();
                image.height = meshView.dimensions.getHeight();
            }
    
            return thumbnail;
        });
    }

    private renderSpriteViews(canvas: UI_SvgCanvas) {
        this.registry.stores.canvasStore
            .getViewsByType(SpriteViewType)
            .forEach(spriteView => {
                const group = canvas.group(spriteView.id);
                group.data = spriteView;
                group.transform = `translate(${spriteView.dimensions.topLeft.x} ${spriteView.dimensions.topLeft.y})`;
                const rect = group.rect();
                rect.width = spriteView.dimensions.getWidth();
                rect.height = spriteView.dimensions.getHeight();
                rect.fillColor = 'green';

                rect.strokeColor = spriteView.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';
    
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
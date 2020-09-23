import { CanvasControllerId, CanvasControllerProps } from '../../../core/plugin/controller/CanvasController';
import { toDegree } from '../../../utils/geometry/Measurements';
import { colors } from '../../../core/ui_components/react/styles';
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { ViewTag, ViewType } from '../../../core/models/views/View';
import { Canvas_2d_Plugin } from '../../../core/plugin/Canvas_2d_Plugin';
import { Registry } from '../../../core/Registry';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { sort } from '../../../utils/geometry/Functions';
import { SceneEditorExporter } from './io/SceneEditorExporter';
import { SceneEditorImporter } from './io/SceneEditorImporter';
import { MeshTool } from './tools/MeshTool';
import { SpriteTool } from './tools/SpriteTool';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { PathView } from '../../../core/models/views/PathView';
import { MeshView } from '../../../core/models/views/MeshView';
import { PathTool } from './tools/PathTool';
import { SelectTool } from '../../../core/plugin/tools/SelectTool';
import { DeleteTool } from '../../../core/plugin/tools/DeleteTool';
import { CameraTool } from '../../../core/plugin/tools/CameraTool';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    viewTypes: string[] = [ViewType.MeshView, ViewType.PathView, SpriteViewType];

    constructor(registry: Registry) {
        super(SceneEditorPluginId, registry);

        this.toolHandler.registerTool(new MeshTool(this, this.registry));
        this.toolHandler.registerTool(new SpriteTool(this, this.registry));
        this.toolHandler.registerTool(new PathTool(this, this.registry));
        this.toolHandler.registerTool(new SelectTool(this, this.registry));
        this.toolHandler.registerTool(new DeleteTool(this, this.registry));
        this.toolHandler.registerTool(new CameraTool(this, this.registry));
        
        this.exporter = new SceneEditorExporter(this, this.registry);
        this.importer = new SceneEditorImporter(this, this.registry);
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    destroy() { 
        this.registry.stores.canvasStore.clearSelection();
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
        getSortedMeshViews(this.registry).map(meshView => {
            const group = canvas.group(meshView.id);
            group.data = meshView;

            const translation = `${meshView.dimensions.topLeft.x} ${meshView.dimensions.topLeft.y}`;
            const rotation = `${toDegree(meshView.getRotation())} ${meshView.dimensions.getWidth() / 2} ${meshView.dimensions.getHeight() / 2}`;
            const scale = `${meshView.getScale(), meshView.getScale()}`;
            group.transform = `translate(${translation}) rotate(${rotation}) scale(${scale})`;
            const rect = group.rect();
            rect.width = meshView.dimensions.getWidth();
            rect.height = meshView.dimensions.getHeight();

            rect.css = {
                strokeWidth: meshView.isSelected() ? '2' : '1'
            }    

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
        this.registry.stores.canvasStore
            .getViewsByType(ViewType.PathView)
            .forEach((pathView: PathView) => {
                const group = canvas.group(pathView.id);
                group.isInteractive = false;

                if (pathView.children.length > 1) {
                    const highlightPath = group.path();
                    highlightPath.d = pathView.serializePath();
                    highlightPath.data = pathView;

                    highlightPath.css = {
                        fill: 'none',
                        stroke: 'blue',
                        strokeOpacity: pathView.isHovered() || pathView.isSelected() ? 0.5 : 0,
                        strokeWidth: "4"
                    }

                    const path = group.path();
                    path.d = pathView.serializePath();

                    path.css = {
                        fill: 'none',
                        stroke: 'black',
                        strokeWidth: "2",
                        pointerEvents: 'none'
                    }
                }

                pathView.children.forEach(editPoint => {
                    const circle = group.circle();

                    circle.cx = editPoint.point.x;
                    circle.cy = editPoint.point.y;
                    circle.r = pathView.radius;
                    circle.data = editPoint;

                    circle.css = {
                        fill: pathView.getActiveChild() === editPoint ? 'orange' : (pathView.isHovered() || pathView.isSelected()) ? 'blue' : 'black'
                    }
                })
            });
    }
}

function getSortedMeshViews(registry: Registry) {
    let items = <MeshView[]> [...registry.stores.canvasStore.getViewsByType(ViewType.MeshView)];
    return sort(items, (a, b) => a.layer - b.layer);
}
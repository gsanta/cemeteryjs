import { MeshViewType } from '../../../core/models/views/MeshView';
import { PathViewType } from '../../../core/models/views/PathView';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { sortViewsByLayer, View } from '../../../core/models/views/View';
import { RedoProp, UndoProp, ZoomInProp, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { Canvas_2d_Plugin } from '../../../core/plugin/Canvas_2d_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { MeshToolId, MeshTool, PrimitiveShapeType } from './tools/MeshTool';
import { PropController, PropContext } from '../../../core/plugin/controller/FormController';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { SelectToolId } from '../../../core/plugin/tools/SelectTool';
import { PathToolId } from './tools/PathTool';
import { CameraToolId } from '../../../core/plugin/tools/CameraTool';
import { DeleteToolId } from '../../../core/plugin/tools/DeleteTool';
import { SpriteToolId } from './tools/SpriteTool';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    viewTypes: string[] = [MeshViewType, PathViewType, SpriteViewType];

    constructor(registry: Registry) {
        super(SceneEditorPluginId, registry);
    }

    getStore() {
        return this.registry.stores.views;
    }

    destroy() { 
        this.registry.stores.views.clearSelection();
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.svgCanvas();

        const toolbar = canvas.toolbar();

        const selectedTool = this.registry.plugins.getToolController(this.id).getSelectedTool();
        
        let tool = toolbar.tool({prop: MeshToolId});
        tool.icon = 'mesh';
        tool.isActive = selectedTool.id === MeshToolId;
        let tooltip = tool.tooltip();
        tooltip.label = 'Add Mesh';

        tool = toolbar.tool({prop: SpriteToolId});
        tool.icon = 'sprite';
        tool.isActive = selectedTool.id === SpriteToolId;
        tooltip = tool.tooltip();
        tooltip.label = 'Add Sprite';

        const meshTool = <MeshTool> (this.registry.plugins.getToolController(this.id).getToolById(MeshToolId));

        if (meshTool) {
            let toolbarDropdown = toolbar.toolbarDropdown({ prop: SceneEditorToolbarProps.SelectPrimitiveShape });
            const toolbarDropdownHeader = toolbarDropdown.header({ prop: SceneEditorToolbarProps.OpenDropdown });
            let shapeTool = toolbarDropdownHeader.tool({prop: MeshToolId});
            shapeTool.isActive = selectedTool.id === MeshToolId && meshTool.selectedPrimitiveShape !== undefined;

            shapeTool.icon = meshTool.selectedPrimitiveShape.toLowerCase();
            tooltip = shapeTool.tooltip();
            tooltip.label = `${meshTool.selectedPrimitiveShape} tool`;
    
            if (meshTool.isShapeDropdownOpen) {
                meshTool.shapes.forEach(shape => {
                    if (shape !== meshTool.selectedPrimitiveShape) {
                        shapeTool = toolbarDropdown.tool({prop: MeshToolId});
                        shapeTool.icon = shape.toLowerCase();
                        tooltip = shapeTool.tooltip();
                        tooltip.label = `${shape} tool`;
                    }
                });    
            }
        }

        
        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool({prop: PathToolId});
        tool.icon = 'path';
        tool.isActive = selectedTool.id === PathToolId;
        tooltip = tool.tooltip();
        tooltip.label = 'Path tool';

        tool = toolbar.tool({prop: SelectToolId});
        tool.icon = 'select';
        tool.isActive = selectedTool.id === SelectToolId;
        tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({prop: DeleteToolId});
        tool.icon = 'delete';
        tool.isActive = selectedTool.id === DeleteToolId;
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({prop: CameraToolId});
        tool.icon = 'pan';
        tool.isActive = selectedTool.id === CameraToolId;
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
            ...this.registry.stores.views.getViewsByType(SpriteViewType),
            ...this.registry.stores.views.getViewsByType(MeshViewType),
            ...this.registry.stores.views.getViewsByType(PathViewType)
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

export enum SceneEditorToolbarProps {
    SelectPrimitiveShape = 'select-primitive-shape',
    OpenDropdown = 'open-dropdown'
}

export class PrimitiveShapeDropdownMenuOpenControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.OpenDropdown]; }

    click(context: PropContext, element: UI_Element) {
        const meshTool = <MeshTool> context.registry.plugins.getToolController(element.pluginId).getToolById(MeshToolId);
        meshTool.isShapeDropdownOpen = !meshTool.isShapeDropdownOpen;

        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.SelectPrimitiveShape]; }

    click(context: PropContext, element: UI_Element) {
        const meshTool = <MeshTool> context.registry.plugins.getToolController(element.pluginId).getToolById(MeshToolId);
        meshTool.selectedPrimitiveShape = element.targetId as PrimitiveShapeType;

        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

import { MeshViewType } from '../../../core/models/views/MeshView';
import { PathViewType } from '../../../core/models/views/PathView';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { sortViewsByLayer, View } from '../../../core/models/views/View';
import { RedoProp, UndoProp, ZoomInProp, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { Canvas_2d_Plugin } from '../../../core/plugin/Canvas_2d_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { MeshToolId, MeshTool } from './tools/MeshTool';
import { PropController, PropContext } from '../../../core/plugin/controller/FormController';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { SelectToolId } from '../../../core/plugin/tools/SelectTool';
import { PathToolId } from './tools/PathTool';
import { CameraToolId } from '../../../core/plugin/tools/CameraTool';
import { DeleteToolId } from '../../../core/plugin/tools/DeleteTool';
import { SpriteToolId } from './tools/SpriteTool';
import { UI_Toolbar } from '../../../core/ui_components/elements/toolbar/UI_Toolbar';
import { CubeToolId } from './tools/CubeTool';
import { SphereToolId } from './tools/SphereTool';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    activeShapeToolId: string = CubeToolId;
    isShapeDropdownOpen = false;

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

        this.renderShapeDropdown(toolbar);
        
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

    private renderShapeDropdown(toolbar: UI_Toolbar) {
        const toolController = this.registry.plugins.getToolController(this.id);
        const selectedTool = toolController.getSelectedTool();

        let toolbarDropdown = toolbar.toolbarDropdown({ prop: SceneEditorToolbarProps.SelectPrimitiveShape });
        const toolbarDropdownHeader = toolbarDropdown.header({ prop: SceneEditorToolbarProps.OpenDropdown });
        
        let tool = toolController.getToolById(this.activeShapeToolId);
        let shapeTool = toolbarDropdownHeader.tool({prop: this.activeShapeToolId});
        shapeTool.isActive = selectedTool.id === this.activeShapeToolId;
        shapeTool.icon = tool.icon;
        let tooltip = shapeTool.tooltip();
        tooltip.label = `${tool.displayName} tool`;

        if (this.isShapeDropdownOpen) {
            tool = toolController.getToolById(CubeToolId);
            shapeTool = toolbarDropdown.tool({prop: SceneEditorToolbarProps.SelectPrimitiveShape});
            shapeTool.targetId = CubeToolId;
            shapeTool.icon = tool.icon;
            tooltip = shapeTool.tooltip();
            tooltip.label = `${tool.displayName} tool`;

            tool = toolController.getToolById(SphereToolId);
            shapeTool = toolbarDropdown.tool({prop: SceneEditorToolbarProps.SelectPrimitiveShape});
            shapeTool.targetId = SphereToolId;
            shapeTool.icon = tool.icon;
            tooltip = shapeTool.tooltip();
            tooltip.label = `${tool.displayName} tool`;
        }
    }
}

export enum SceneEditorToolbarProps {
    SelectPrimitiveShape = 'select-primitive-shape',
    OpenDropdown = 'open-dropdown'
}

export class PrimitiveShapeDropdownMenuOpenControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.OpenDropdown]; }

    click(context: PropContext, element: UI_Element) {
        const plugin = <SceneEditorPlugin> context.registry.plugins.getById(element.pluginId);
        plugin.isShapeDropdownOpen = !plugin.isShapeDropdownOpen;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.SelectPrimitiveShape]; }

    click(context: PropContext, element: UI_Element) {
        context.registry.plugins.getToolController(element.pluginId).setSelectedTool(element.targetId);
        (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).isShapeDropdownOpen = false;
        (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).activeShapeToolId = element.targetId;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

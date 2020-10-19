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
import { MeshToolId, MeshTool, PrimitiveShapeType } from './tools/MeshTool';
import { PropController, PropContext } from '../../../core/plugin/controller/FormController';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_Region } from '../../../core/plugin/UI_Plugin';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    viewTypes: string[] = [MeshViewType, PathViewType, SpriteViewType];
    isDropdownOpen = false;

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
        
        let tool = toolbar.tool(MeshToolId);
        tool.icon = 'mesh';
        let tooltip = tool.tooltip();
        tooltip.label = 'Add Mesh';

        tool = toolbar.tool(ToolType.Sprite);
        tool.icon = 'sprite';
        tooltip = tool.tooltip();
        tooltip.label = 'Add Sprite';

        const meshTool = <MeshTool> (this.registry.plugins.getToolController(this.id).getToolById(MeshToolId));

        if (meshTool) {
            let toolbarDropdown = toolbar.toolbarDropdown({ prop: SceneEditorToolbarProps.SelectPrimitiveShape });
            const toolbarDropdownHeader = toolbarDropdown.header({});
            let primitiveMeshTool = toolbarDropdownHeader.tool('abcd');
            primitiveMeshTool.icon = meshTool.selectedPrimitiveShape.toLowerCase();
            tooltip = primitiveMeshTool.tooltip();
            tooltip.label = `${meshTool.selectedPrimitiveShape} tool`;
    
            toolbarDropdown.isOpen = this.isDropdownOpen;
    
            primitiveMeshTool = toolbarDropdown.tool('abcd');
            primitiveMeshTool.icon = 'cube';
            tooltip = primitiveMeshTool.tooltip();
            tooltip.label = 'Cube tool';
    
            primitiveMeshTool = toolbarDropdown.tool('abcdefg');
            primitiveMeshTool.icon = 'sphere';
            tooltip = primitiveMeshTool.tooltip();
            tooltip.label = 'Sphere tool';
        }

        
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
    SelectPrimitiveShape = 'select-primitive-shape'
}

export class PrimitiveShapeDropdownControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.SelectPrimitiveShape]; }

    click(context: PropContext, element: UI_Element) {
        const meshTool = <MeshTool> context.registry.plugins.getById(element.pluginId).getToolController().getToolById(MeshToolId);
        meshTool.selectedPrimitiveShape = element.targetId as PrimitiveShapeType;

        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

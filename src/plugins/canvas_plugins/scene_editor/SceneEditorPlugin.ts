import { MeshViewType } from '../../../core/models/views/MeshView';
import { PathViewType } from '../../../core/models/views/PathView';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { sortViewsByLayer, View } from '../../../core/models/views/View';
import { AbstractCanvasPlugin, RedoController, RedoProp, UndoController, UndoProp, ZoomInController, ZoomInProp, ZoomOutController, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { FormController, PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController, ToolController } from '../../../core/plugin/controller/ToolController';
import { CameraToolId } from '../../../core/plugin/tools/CameraTool';
import { DeleteToolId } from '../../../core/plugin/tools/DeleteTool';
import { SelectToolId } from '../../../core/plugin/tools/SelectTool';
import { UI_Model } from '../../../core/plugin/UI_Model';
import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { cameraInitializer, UI_Plugin } from '../../../core/plugin/UI_Plugin';
import { UI_Renderer } from '../../../core/plugin/UI_PluginFactory';
import { Registry } from '../../../core/Registry';
import { UI_Toolbar } from '../../../core/ui_components/elements/toolbar/UI_Toolbar';
import { UI_Container } from '../../../core/ui_components/elements/UI_Container';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { SceneEditorRenderer } from './SceneEditorRenderer';
import { AxisToolId } from './tools/AxisTool';
import { CubeToolId } from './tools/CubeTool';
import { MeshToolId } from './tools/MeshTool';
import { PathToolId } from './tools/PathTool';
import { ScaleToolId } from './tools/ScaleTool';
import { SphereToolId } from './tools/SphereTool';
import { SpriteToolId } from './tools/SpriteTool';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';

export const SceneEditorPluginId = 'scene-editor-plugin';
export class SceneEditorPlugin implements UI_Plugin {
    id: string;
    region: UI_Region;
    private panel: UI_Panel;
    private controller: FormController;
    private toolController: ToolController;
    private model: UI_Model;
    private registry: Registry;

    // TODO: temporary fields, should be in UI_Model
    activeShapeToolId: string = CubeToolId;
    isShapeDropdownOpen = false;

    constructor(registry: Registry, region: UI_Region) {
        this.registry = registry;
        this.region = region;
        this.panel = new AbstractCanvasPlugin(registry, cameraInitializer(SceneEditorPluginId, registry), this.region);
        this.renderer = new SceneEditorRenderer(registry, this);


        const propControllers = [
            new ZoomInController(),
            new ZoomOutController(),
            new UndoController(),
            new RedoController(),
            new PrimitiveShapeDropdownControl(),
            new PrimitiveShapeDropdownMenuOpenControl(),
            new CommonToolController(),
            new SceneEditorToolController(),
            new CanvasContextDependentToolController()
        ]

        this.controller = new FormController(this.panel, registry, propControllers);

        this.model = new UI_Model();
    }

    getPanel() {
        return this.panel;
    }

    getController() {
        return this.controller;
    }

    getToolController() {
        return this.toolController;
    }

    getModel() {
        return this.model;
    }

    renderInto(layout: UI_Layout) {
        const canvas = layout.svgCanvas();

        const toolbar = canvas.toolbar();

        let tool = toolbar.tool({prop: MeshToolId});
        tool.icon = 'mesh';
        tool.isActive = this.getToolController().getToolById(MeshToolId).isSelected;
        let tooltip = tool.tooltip();
        tooltip.label = 'Add Mesh';

        tool = toolbar.tool({prop: SpriteToolId});
        tool.icon = 'sprite';
        tool.isActive = this.getToolController().getToolById(SpriteToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Add Sprite';

        this.renderShapeDropdown(toolbar);
        
        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool({prop: PathToolId});
        tool.icon = 'path';
        tool.isActive = this.getToolController().getToolById(PathToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Path tool';

        tool = toolbar.tool({prop: SelectToolId});
        tool.icon = 'select';
        tool.isActive = this.getToolController().getToolById(SelectToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({prop: DeleteToolId});
        tool.icon = 'delete';
        tool.isActive = this.getToolController().getToolById(DeleteToolId).isSelected;
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({prop: CameraToolId});
        tool.icon = 'pan';
        tool.isActive = this.getToolController().getToolById(CameraToolId).isSelected;
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

        actionIcon = toolbar.actionIcon({prop: ScaleToolId});
        actionIcon.icon = 'scale';
        actionIcon.isActivated = this.getToolController().getToolById(ScaleToolId).isSelected;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Scale';

        actionIcon = toolbar.actionIcon({prop: AxisToolId});
        actionIcon.icon = 'move';
        actionIcon.isActivated = this.getToolController().getToolById(AxisToolId).isSelected;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Move';

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
            this.registry.services.viewService.renderInto(canvas, view, this);
            view.children.forEach(child => this.registry.services.viewService.renderInto(canvas, child, this));
        });
    }

    private renderShapeDropdown(toolbar: UI_Toolbar) {
        const toolController = this.registry.plugins.getToolController(this.id);

        let toolbarDropdown = toolbar.toolbarDropdown({ prop: SceneEditorToolbarProps.SelectPrimitiveShape });
        const toolbarDropdownHeader = toolbarDropdown.header({ prop: SceneEditorToolbarProps.OpenDropdown });
        
        let tool = toolController.getToolById(this.activeShapeToolId);
        let shapeTool = toolbarDropdownHeader.tool({prop: this.activeShapeToolId});
        shapeTool.isActive = this.getToolController().getToolById(this.activeShapeToolId).isSelected;
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
        // const plugin = <SceneEditorPlugin> context.registry.plugins.getById(element.pluginId);
        // plugin.isShapeDropdownOpen = !plugin.isShapeDropdownOpen;
        // context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.SelectPrimitiveShape]; }

    click(context: PropContext, element: UI_Element) {
        // context.registry.plugins.getToolController(element.pluginId).setSelectedTool(element.targetId);
        // (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).isShapeDropdownOpen = false;
        // (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).activeShapeToolId = element.targetId;
        // context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

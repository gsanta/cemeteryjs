import { MeshViewType } from '../../../core/models/views/MeshView';
import { PathViewType } from '../../../core/models/views/PathView';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { sortViewsByLayer, View } from '../../../core/models/views/View';
import { AbstractCanvasPlugin, RedoController, RedoProp, UndoController, UndoProp, ZoomInController, ZoomInProp, ZoomOutController, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { FormController, PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { CanvasContextDependentToolController, CommonToolController, SceneEditorToolController, ToolController } from '../../../core/plugin/controller/ToolController';
import { CameraTool, CameraToolId } from '../../../core/plugin/tools/CameraTool';
import { DeleteTool, DeleteToolId } from '../../../core/plugin/tools/DeleteTool';
import { SelectTool, SelectToolId } from '../../../core/plugin/tools/SelectTool';
import { UI_Model } from '../../../core/plugin/UI_Model';
import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { cameraInitializer, UI_Plugin } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Toolbar } from '../../../core/ui_components/elements/toolbar/UI_Toolbar';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { MoveAxisTool, MoveAxisToolId } from '../canvas_utility_plugins/canvas_mesh_transformations/tools/MoveAxisTool';
import { CubeTool, CubeToolId } from './tools/CubeTool';
import { MeshTool, MeshToolId } from './tools/MeshTool';
import { PathTool, PathToolId } from './tools/PathTool';
import { ScaleAxisTool, ScaleAxisToolId } from '../canvas_utility_plugins/canvas_mesh_transformations/tools/ScaleAxisTool';
import { SphereTool, SphereToolId } from './tools/SphereTool';
import { SpriteTool, SpriteToolId } from './tools/SpriteTool';

export const SceneEditorPluginId = 'scene-editor-plugin';
export class SceneEditorPlugin implements UI_Plugin {
    id: string = SceneEditorPluginId;
    displayName = 'Scene editor';
    region: UI_Region = UI_Region.Canvas1;
    private panel: UI_Panel;
    private controller: FormController;
    private _toolController: ToolController;
    private model: UI_Model;
    private registry: Registry;

    // TODO: temporary fields, should be in UI_Model
    activeShapeToolId: string = CubeToolId;
    isShapeDropdownOpen = false;

    constructor(registry: Registry) {
        this.registry = registry;
        this.panel = new AbstractCanvasPlugin(registry, cameraInitializer(SceneEditorPluginId, registry), this.region, SceneEditorPluginId, this);


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

        this.controller = new FormController(this, registry, propControllers);

        const tools = [
            new MeshTool(this, registry),
            new SpriteTool(this, registry),
            new PathTool(this, registry),
            new SelectTool(this, registry),
            new DeleteTool(this, registry),
            new CameraTool(this, registry),
            new MoveAxisTool(this, registry),
            new CubeTool(this, registry),
            new SphereTool(this, registry),
            new ScaleAxisTool(this, registry)
        ];

        this._toolController = new ToolController(this.panel as AbstractCanvasPlugin, this.registry, tools);

        this.model = new UI_Model();
    }

    getPanel() {
        return this.panel;
    }

    getController() {
        return this.controller;
    }

    getToolController() {
        return this._toolController;
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

        actionIcon = toolbar.actionIcon({prop: ScaleAxisToolId});
        actionIcon.icon = 'scale';
        actionIcon.isActivated = this.getToolController().getToolById(ScaleAxisToolId).isSelected;
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Scale';

        actionIcon = toolbar.actionIcon({prop: MoveAxisToolId});
        actionIcon.icon = 'move';
        actionIcon.isActivated = this.getToolController().getToolById(MoveAxisToolId).isSelected;
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
        const toolController = this.getToolController();

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

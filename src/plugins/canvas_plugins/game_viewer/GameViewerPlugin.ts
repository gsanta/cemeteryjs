import { AbstractCanvasPlugin, ZoomInController, ZoomInProp, ZoomOutController, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { GameViewerProps, PlayController, StopController } from './GameViewerProps';
import { GameTool, GameToolId } from './tools/GameTool';
import { CameraTool, CameraToolId } from '../../../core/plugin/tools/CameraTool';
import { UI_Plugin } from '../../../core/plugin/UI_Plugin';
import { FormController, PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { CommonToolController, ToolController } from '../../../core/plugin/controller/ToolController';
import { UI_Model } from '../../../core/plugin/UI_Model';
import { GizmoPlugin } from '../../../core/plugin/IGizmo';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
(<any> window).earcut = require('earcut');

export const GameViewerPluginId = 'game-viewer-plugin'; 
export const GameViewerPluginControllerId = 'game-viewer-plugin-controller';

export class GameViewerPlugin implements UI_Plugin {
    id: string = GameViewerPluginId;
    displayName = 'Game viewer';
    region: UI_Region = UI_Region.Canvas2;
    private panel: UI_Panel;
    private controller: FormController;
    private _toolController: ToolController;
    private model: UI_Model;
    private registry: Registry;

    private gizmos: GizmoPlugin[] = [];

    constructor(registry: Registry) {
        this.registry = registry;

        this.panel = new AbstractCanvasPlugin(registry, this.registry.engine.getCamera(), this.region, GameViewerPluginId, this);

        const propControllers = [
            new ZoomInController(),
            new ZoomOutController(),
            new PlayController(),
            new StopController(),
            new CommonToolController(),
            new GameViewerToolController()
        ]

        this.controller = new FormController(this, registry, propControllers);

        const tools = [
            new GameTool(this, registry),
            new CameraTool(this, registry)
        ]

        this._toolController = new ToolController(this.panel as AbstractCanvasPlugin, this.registry, tools);

        this.model = new UI_Model();

        this.panel.onMounted(() => this.mounted());
        this.panel.onUnmounted(() => this.unmounted());
    }

    private mounted() {
        this.registry.engine.setup(document.querySelector(`#${GameViewerPluginId} canvas`));
        this.registry.engine.resize();

        this.gizmos.forEach(gizmo => gizmo.mount());
    }

    private unmounted() {
        this.registry.engine.meshLoader.clear();
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
        const canvas = layout.htmlCanvas();

        const selectedTool = this.getToolController().getSelectedTool();

        const toolbar = canvas.toolbar();

        let tool = toolbar.tool({key: CameraToolId});
        tool.isActive = selectedTool.id === CameraToolId;
        tool.icon = 'pan';
        let tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({key: ZoomInProp, uniqueId: `${ZoomInProp}-${this.id}`});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({key: ZoomOutProp, uniqueId: `${ZoomOutProp}-${this.id}`});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        tool = toolbar.tool({key: GameToolId});
        tool.isActive = selectedTool.id === GameToolId;
        tool.icon = 'games';
        tool.placement = 'middle';
        tooltip = tool.tooltip();
        tooltip.label = 'Game tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'middle';

        actionIcon = toolbar.actionIcon({key: GameViewerProps.Play, uniqueId: `${GameViewerProps.Play}-${this.id}`});
        actionIcon.icon = 'play';
        actionIcon.placement = 'middle';
        actionIcon.isActivated = this.registry.stores.game.gameState === 'running';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Play';

        actionIcon = toolbar.actionIcon({key: GameViewerProps.Stop, uniqueId: `${GameViewerProps.Stop}-${this.id}`});
        actionIcon.icon = 'stop';
        actionIcon.placement = 'middle';
        actionIcon.isActivated = this.registry.stores.game.gameState === 'paused';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Stop';


        const gizmoLayer = canvas.gizmoLayer();
        
        this.gizmos.forEach(gizmo => gizmo.renderInto(gizmoLayer));
    }
}

export class GameViewerToolController extends PropController<any> {
    acceptedProps() { return [GameToolId]; }

    click(context: PropContext, element: UI_Element) {
        context.plugin.getToolController().setSelectedTool(element.key);
        context.registry.services.render.reRender(context.registry.plugins.getPanelById(element.pluginId).region);
    }
}
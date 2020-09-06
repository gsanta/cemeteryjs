import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { BuiltinNodeType } from '../../../core/models/game_objects/NodeObj';
import { Canvas_3d_Plugin } from '../../../core/plugins/Canvas_3d_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { PluginServices } from '../../../core/plugins/PluginServices';
import { Gizmos } from './Gizmos';
import { NodeService } from './services/NodeService';
import { GameViewerSettings } from './settings/GameViewerSettings';
import { Bab_EngineFacade } from '../../../core/adapters/babylonjs/Bab_EngineFacade';
import { ToolType } from '../../../core/plugins/tools/Tool';
import { GameViewerController, GameViewerProps } from './GameViewerController';
import { AxisGizmo } from './AxisGizmo';
(<any> window).earcut = require('earcut');

export const GameViewerPluginId = 'game-viewer-plugin'; 
export class GameViewerPlugin extends Canvas_3d_Plugin {
    id = GameViewerPluginId;
    region = UI_Region.Canvas2;
    gameViewerSettings: GameViewerSettings;

    private gizmos: Gizmos;

    private controller: GameViewerController;

    constructor(registry: Registry) {
        super(GameViewerPluginId, registry);

        this.gameViewerSettings = new GameViewerSettings(registry);
        this.gizmos = new Gizmos(this, registry);

        this.pluginServices = new PluginServices(
            [
                new NodeService(this, this.registry)
            ]
        );

        this.controller = new GameViewerController(this, this.registry);
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);

        this.registry.engine.setup(document.querySelector(`#${GameViewerPluginId} canvas`));
        (this.registry.engine as Bab_EngineFacade).engine.resize();
        (this.registry.engine as Bab_EngineFacade).scene.registerAfterRender(() => {
            this.gizmos.update();
        });
        
        const nodeService = this.pluginServices.byName<NodeService>(NodeService.serviceName);
        nodeService.getNodesByType(BuiltinNodeType.Route).forEach(node => nodeService.getHandler(node).wake(node));
        
        this.gizmos.awake();
        this.renderFunc && this.renderFunc();
    }

    destroy() {
        this.registry.engine.meshLoader.clear();
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.htmlCanvas({controllerId: activeToolId});

        const toolbar = canvas.toolbar();

        toolbar.controller = this.controller;

        let tool = toolbar.tool({controllerId: ToolType.Camera, key: ToolType.Move});
        tool.icon = 'pan';
        let tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({prop: GameViewerProps.ZoomIn});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: GameViewerProps.ZoomOut});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

    }
}
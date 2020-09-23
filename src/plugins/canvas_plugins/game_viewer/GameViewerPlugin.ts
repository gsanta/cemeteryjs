import { Bab_EngineFacade } from '../../../core/adapters/babylonjs/Bab_EngineFacade';
import { Canvas_3d_Plugin } from '../../../core/plugin/Canvas_3d_Plugin';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { GameViewerController, GameViewerProps } from './GameViewerController';
import { Gizmos } from './Gizmos';
import { GameTool, GameToolType } from './tools/GameTool';
(<any> window).earcut = require('earcut');

export const GameViewerPluginId = 'game-viewer-plugin'; 
export class GameViewerPlugin extends Canvas_3d_Plugin {
    id = GameViewerPluginId;
    region = UI_Region.Canvas2;

    private gizmos: Gizmos;

    private controller: GameViewerController;

    constructor(registry: Registry) {
        super(GameViewerPluginId, registry);

        this.gizmos = new Gizmos(this, registry);
        
        this.toolHandler.registerTool(new GameTool(this, this.registry));

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

        let tool = toolbar.tool({controllerId: ToolType.Camera, key: ToolType.Camera});
        tool.icon = 'pan';
        let tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool({controllerId: GameToolType, key: GameToolType});
        tool.icon = 'games';
        tooltip = tool.tooltip();
        tooltip.label = 'Game tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({prop: GameViewerProps.ZoomIn});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: GameViewerProps.Play});
        actionIcon.icon = 'play';
        actionIcon.placement = 'middle';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Play';

        actionIcon = toolbar.actionIcon({prop: GameViewerProps.Stop});
        actionIcon.icon = 'stop';
        actionIcon.placement = 'middle';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Stop';

    }
}
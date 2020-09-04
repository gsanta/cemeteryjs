import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { BuiltinNodeType } from '../../../core/models/game_objects/NodeModel';
import { Canvas_3d_Plugin } from '../../../core/plugins/Canvas_3d_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { PluginServices } from '../../../core/plugins/PluginServices';
import { Gizmos } from './Gizmos';
import { GameViewerImporter } from './io/GameViewerImporter';
import { NodeService } from './services/NodeService';
import { GameViewerSettings } from './settings/GameViewerSettings';
import { Bab_EngineFacade } from '../../../core/adapters/babylonjs/Bab_EngineFacade';
(<any> window).earcut = require('earcut');

export const GameViewerPluginId = 'game-viewer-plugin'; 
export class GameViewerPlugin extends Canvas_3d_Plugin {
    id = GameViewerPluginId;
    region = UI_Region.Canvas2;
    gameViewerSettings: GameViewerSettings;

    // private axisGizmo: AxisGizmo;
    private gizmos: Gizmos;

    constructor(registry: Registry) {
        super(GameViewerPluginId, registry);

        this.gameViewerSettings = new GameViewerSettings(registry);
        // this.axisGizmo = new AxisGizmo(this.registry, MeshBuilder);
        this.gizmos = new Gizmos(this, registry);
        this.importer = new GameViewerImporter(this, this.registry);

        this.pluginServices = new PluginServices(
            [
                new NodeService(this, this.registry)
            ]
        );
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);

        this.registry.engine.setup(htmlElement.getElementsByTagName('canvas')[0]);
        (this.registry.engine as Bab_EngineFacade).engine.resize();
        // (this.registry.engine as BabylonEngineFacade).scene.registerAfterRender(() => {
        //     this.gizmos.update();
        // });

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
    }
}
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { BuiltinNodeType } from '../../../core/models/game_objects/NodeModel';
import { Canvas_3d_Plugin } from '../../../core/plugins/Canvas_3d_Plugin';
import { Registry } from '../../../core/Registry';
import { EngineService } from '../../../core/services/EngineService';
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';
import { TextureLoaderService } from '../../../core/services/TextureLoaderService';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { PluginServices } from '../../common/PluginServices';
import { Gizmos } from './Gizmos';
import { GameViewerImporter } from './io/GameViewerImporter';
import { NodeService } from './services/NodeService';
import { GameViewerSettings } from './settings/GameViewerSettings';
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
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry),
                new NodeService(this, this.registry),
                new TextureLoaderService(this, this.registry)
            ]
        );
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);
        (<GameViewerImporter> this.importer).import();

        const nodeService = this.pluginServices.byName<NodeService>(NodeService.serviceName);
        nodeService.getNodesByType(BuiltinNodeType.Route).forEach(node => nodeService.getHandler(node).wake(node));

        const engineService = this.pluginServices.byName<EngineService<any>>(EngineService.serviceName);
        engineService.getScene().registerAfterRender(() => {
            this.gizmos.update();
        });
        
        this.gizmos.awake();
        this.renderFunc && this.renderFunc();
    }

    destroy() {
        this.registry.stores.meshStore.clear();
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.htmlCanvas({controllerId: activeToolId});

        const toolbar = canvas.toolbar();
    }
}
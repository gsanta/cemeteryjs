import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { NodeType } from '../../core/models/nodes/NodeModel';
import { Registry } from '../../core/Registry';
import { LayoutType } from '../../core/services/PluginService';
import { Camera3D } from '../common/camera/Camera3D';
import { ICamera } from '../common/camera/ICamera';
import { toolFactory } from '../common/toolbar/toolFactory';
import { Tool, ToolType } from '../common/tools/Tool';
import { Tools } from '../Tools';
import { Gizmos } from './Gizmos';
import { GameViewerImporter } from './io/GameViewerImporter';
import { GameViewerSettings } from './settings/GameViewerSettings';
import { PluginServices } from '../common/PluginServices';
import { EngineService } from '../../core/services/EngineService';
import { MeshLoaderService } from '../../core/services/MeshLoaderService';
import { NodeService } from './services/NodeService';
(<any> window).earcut = require('earcut');

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export class GameViewerPlugin extends AbstractPlugin {
    static id = 'game-viewer-plugin';
    gameViewerSettings: GameViewerSettings;

    // private axisGizmo: AxisGizmo;
    private gizmos: Gizmos;

    constructor(registry: Registry) {
        super(registry);

        const tools = [ToolType.Camera].map(toolType => toolFactory(toolType, this, registry));
        this.tools = new Tools(tools);

        this.selectedTool = this.tools.byType(ToolType.Camera);

        this.gameViewerSettings = new GameViewerSettings(registry);
        // this.axisGizmo = new AxisGizmo(this.registry, MeshBuilder);
        this.gizmos = new Gizmos(this, registry);
        this.importer = new GameViewerImporter(this, this.registry);

        this.pluginServices = new PluginServices(
            [
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry),
                new NodeService(this, this.registry)
            ]
        );
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    getCamera(): ICamera {
        return this.pluginServices.engineService().getCamera();
    }

    resize() {
        const engineService = this.pluginServices.byName<EngineService<this>>(EngineService.serviceName);
        engineService.getEngine() && engineService.getEngine().resize();
    }

    componentMounted(htmlElement: HTMLElement) {
        super.componentMounted(htmlElement);
        // this.registry.services.game.init(this.htmlElement as HTMLCanvasElement);
        // const engineService = this.pluginServices.byName<EngineService<this>>(EngineService.serviceName);
        // this.camera = new Camera3D(this.registry, engineService.getEngine(), engineService.getScene());

        this.registry.services.game.importAllConcepts();

        const nodeService = this.pluginServices.byName<NodeService>(NodeService.serviceName);
        nodeService.getNodesByType(NodeType.Route).forEach(node => nodeService.getHandler(node).wake(node));

        this.registry.services.game.registerAfterRender(() => {
            // this.axisGizmo.updateWorldAxis();
            this.gizmos.update();
        });
        
        this.gizmos.awake();
        this.renderFunc && this.renderFunc();
    }

    getId(): string {
        return GameViewerPlugin.id;
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }    

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }
}
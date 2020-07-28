import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { NodeType } from '../../core/models/nodes/NodeModel';
import { Registry } from '../../core/Registry';
import { LayoutType } from '../Plugins';
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
import { TextureLoaderService } from '../../core/services/TextureLoaderService';
import { UI_Region } from '../../core/UI_Plugin';
(<any> window).earcut = require('earcut');

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export const GameViewerPluginId = 'game-viewer-plugin'; 

export class GameViewerPlugin extends AbstractPlugin {
    id = GameViewerPluginId;
    region = UI_Region.Canvas2;
    gameViewerSettings: GameViewerSettings;

    // private axisGizmo: AxisGizmo;
    private gizmos: Gizmos;

    constructor(registry: Registry) {
        super(registry);

        this.addTool(toolFactory(ToolType.Camera, this, registry))
        this.selectedTool = this.getToolById(ToolType.Camera);

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

    getCamera(): ICamera {
        return this.pluginServices.engineService().getCamera();
    }

    resize() {
        const engineService = this.pluginServices.byName<EngineService<this>>(EngineService.serviceName);
        engineService.getEngine() && engineService.getEngine().resize();
    }

    componentMounted(htmlElement: HTMLElement) {
        super.componentMounted(htmlElement);
        (<GameViewerImporter> this.importer).import();

        const nodeService = this.pluginServices.byName<NodeService>(NodeService.serviceName);
        nodeService.getNodesByType(NodeType.Route).forEach(node => nodeService.getHandler(node).wake(node));

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

    getSelectedTool(): Tool {
        return this.selectedTool;
    }    

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }
}
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
(<any> window).earcut = require('earcut');

export function cameraInitializer(registry: Registry) {
    if (registry.services.game) {
        return new Camera3D(registry, registry.services.game.getEngine(), registry.services.game.getScene());
    }

    return null;
}

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export class GameViewerPlugin extends AbstractPlugin {
    static id = 'game-viewer-plugin';
    visible = true;
    allowedLayouts = new Set([LayoutType.Single, LayoutType.Double]);
    gameViewerSettings: GameViewerSettings;

    // private axisGizmo: AxisGizmo;
    private gizmos: Gizmos;

    private camera: Camera3D;

    constructor(registry: Registry) {
        super(registry);

        const tools = [ToolType.Camera].map(toolType => toolFactory(toolType, this, registry));
        this.tools = new Tools(tools);

        this.selectedTool = this.tools.byType(ToolType.Camera);

        this.gameViewerSettings = new GameViewerSettings(registry);
        // this.axisGizmo = new AxisGizmo(this.registry, MeshBuilder);
        this.gizmos = new Gizmos(registry);
        this.importer = new GameViewerImporter(this, this.registry);

        this.pluginServices = new PluginServices(
            [
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry)
            ]
        );
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    getCamera(): ICamera {
        return this.camera;
    }

    resize() {
        if (this.registry.services.game && this.registry.services.game.gameEngine) {
            this.registry.services.game.gameEngine.engine.resize();
        }
    }

    setup(htmlElement: HTMLElement) {
        super.setup(htmlElement);
        // this.registry.services.game.init(this.htmlElement as HTMLCanvasElement);
        this.camera = cameraInitializer(this.registry);
        this.registry.services.game.importAllConcepts();

        this.registry.services.node.getNodesByType(NodeType.Route).forEach(node => this.registry.services.node.getHandler(node).wake(node));

        this.registry.services.game.registerAfterRender(() => {
            // this.axisGizmo.updateWorldAxis();
            this.gizmos.update();
        });
        
        this.gizmos.awake();
        this.renderFunc && this.renderFunc();
    }


    destroy() {
        this.registry.services.game.destroy();
    }

    getId(): string {
        return GameViewerPlugin.id;
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }    

    getOffset() {
        return calcOffsetFromDom(this.getId());
    }
}
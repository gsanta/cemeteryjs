import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { NodeType } from '../../core/models/nodes/NodeModel';
import { Registry } from '../../core/Registry';
import { LayoutType } from '../../core/services/PluginService';
import { RenderService } from '../../core/services/RenderServices';
import { Camera3D } from '../common/camera/Camera3D';
import { ICamera } from '../common/camera/ICamera';
import { Tool } from '../common/tools/Tool';
import { AxisGizmo } from './AxisGizmo';
import { GameViewerSettings } from './settings/GameViewerSettings';
import { MeshBuilder } from 'babylonjs';
(<any> window).earcut = require('earcut');

export function cameraInitializer(registry: Registry) {
    if (registry.services.game) {
        return new Camera3D(registry);
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
    updateService: RenderService;
    allowedLayouts = new Set([LayoutType.Single, LayoutType.Double]);

    gameViewerSettings: GameViewerSettings;

    private axisGizmo: AxisGizmo;

    private camera: Camera3D;

    constructor(registry: Registry) {
        super(registry);

        this.selectedTool = this.registry.tools.pan;

        this.updateService = new RenderService(registry);
        this.gameViewerSettings = new GameViewerSettings(registry);
        this.axisGizmo = new AxisGizmo(this.registry, MeshBuilder);
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

    setup() {
        this.registry.services.game.init(getCanvasElement(this.getId()));
        this.camera = cameraInitializer(this.registry);
        this.registry.services.game.importAllConcepts();

        this.registry.services.node.getNodesByType(NodeType.Route).forEach(node => this.registry.services.node.getHandler(node).wake(node));

        this.registry.services.game.registerAfterRender(() => {
            this.axisGizmo.updateWorldAxis();
        });

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
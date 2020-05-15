import { Registry } from '../../core/Registry';
import { Tool } from '../common/tools/Tool';
import { UpdateService } from '../../core/services/UpdateServices';
import { calcOffsetFromDom, AbstractPlugin } from '../../core/View';
import { HelperMeshes } from './HelperMeshes';
import { ICamera } from '../common/camera/ICamera';
import { Camera3D } from '../common/camera/Camera3D';
import { AbstractStore } from '../../core/stores/AbstractStore';
import { ActionStore } from '../../core/stores/ActionStore';
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
    updateService: UpdateService;

    private helperMeshes: HelperMeshes;

    private renderCanvasFunc: () => void;
    private camera: Camera3D;

    constructor(registry: Registry) {
        super(registry);

        this.selectedTool = this.registry.tools.pan;

        this.updateService = new UpdateService(registry);
        this.update = this.update.bind(this);
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    getCamera(): ICamera {
        return this.camera;
    }

    resize() {
        if (this.registry.services.game.gameEngine) {
            this.registry.services.game.gameEngine.engine.resize();
        }
    }

    setup() {
        this.registry.services.game.init(getCanvasElement(this.getId()));
        this.camera = cameraInitializer(this.registry);
        this.registry.services.game.importAllConcepts();

        this.update();
    }


    destroy() {

    }

    update() {
        this.renderCanvasFunc();
    }


    getId(): string {
        return GameViewerPlugin.id;
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
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
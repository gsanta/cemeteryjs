import { Registry } from '../../editor/Registry';
import { GameService } from '../../core/services/GameService';
import { Tool } from '../../core/tools/Tool';
import { UpdateService } from '../../core/services/UpdateServices';
import { calcOffsetFromDom, View } from '../../editor/views/View';
import { HelperMeshes } from './HelperMeshes';
import { ICamera } from './ICamera';
import { RendererCamera } from './RendererCamera';
(<any> window).earcut = require('earcut');

export function cameraInitializer(registry: Registry) {
    if (registry.services.game) {
        return new RendererCamera(registry);
    }

    return null;
}

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);

        return canvas;
    }
}


export class RendererView extends View {
    static id = 'webgl-editor';
    visible = true;
    updateService: UpdateService;

    private helperMeshes: HelperMeshes;

    private renderCanvasFunc: () => void;
    private camera: RendererCamera;

    constructor(registry: Registry) {
        super(registry);

        this.registry.services.game = new GameService(registry);
        this.selectedTool = this.registry.services.tools.pan;

        this.updateService = new UpdateService(registry);
        this.update = this.update.bind(this);
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
        return RendererView.id;
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
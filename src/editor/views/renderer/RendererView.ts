import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { Tool } from '../../services/tools/Tool';
import { UpdateService } from '../../services/UpdateServices';
import { View, calcOffsetFromDom } from '../View';
import { HelperMeshes } from './HelperMeshes';
import { ICamera } from './ICamera';
import { RendererCamera } from './RendererCamera';
import { Stores } from '../../stores/Stores';
import { GameService } from '../../services/GameService';
import { Registry } from '../../Registry';
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
        this.registry.services.game.gameEngine.engine.resize();
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
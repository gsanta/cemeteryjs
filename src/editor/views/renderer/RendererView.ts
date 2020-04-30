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
(<any> window).earcut = require('earcut');

export function cameraInitializer(getServices: () => ServiceLocator, getStores: () => Stores) {
    if (getServices().game) {
        return new RendererCamera(getServices);
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

    constructor(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(editor, getServices, getStores);

        this.getServices().game = new GameService(getServices, getStores);

        this.updateService = new UpdateService(this.editor, getServices, getStores);
        this.update = this.update.bind(this);
    }

    getCamera(): ICamera {
        return this.camera;
    }

    resize() {
        this.getServices().game.gameEngine.engine.resize();
    }

    setup() {
        this.getServices().game.init(getCanvasElement(this.getId()));
        this.camera = cameraInitializer(this.getServices, this.getStores);
        this.getServices().game.importAllConcepts();

        this.selectedTool = this.getServices().tools.zoom;

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
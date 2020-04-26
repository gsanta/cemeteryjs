import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { Tool } from '../../services/tools/Tool';
import { UpdateService } from '../../services/UpdateServices';
import { View, calcOffsetFromDom } from '../View';
// import { RendererCamera } from './RendererCamera';
import { HelperMeshes } from './HelperMeshes';
import { ICamera } from './ICamera';
import { RendererCamera } from './RendererCamera';
import { Stores } from '../../stores/Stores';
(<any> window).earcut = require('earcut');

export function cameraInitializer(getServices: () => ServiceLocator, getStores: () => Stores) {
    if (getServices().game) {
        return new RendererCamera(getServices);
    }

    return null;
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

        this.updateService = new UpdateService(this.editor, getServices, getStores);
        this.update = this.update.bind(this);
    }

    getCamera(): ICamera {
        if (!this.camera) {
            this.camera = cameraInitializer(this.getServices, this.getStores);
        }

        return this.camera;
    }

    resize() {
        this.camera && this.camera.camera.dispose();
        this.camera = cameraInitializer(this.getServices, this.getStores);
        this.getServices().game.gameEngine.engine.resize();
    }

    setup() {
        this.selectedTool = this.getServices().tools.zoom;

        this.updateCamera();
        this.update();
    }

    update() {
        this.camera = cameraInitializer(this.getServices, this.getStores);
        this.renderWindow();
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

    renderWindow() {
        this.renderCanvasFunc();
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

    updateCamera() {
        if (!this.camera) {
            this.camera = cameraInitializer(this.getServices, this.getStores);
        }
    }
}
import { Registry } from '../../core/Registry';
import { Tool } from '../common/tools/Tool';
import { UpdateService } from '../../core/services/UpdateServices';
import { calcOffsetFromDom, View } from '../../core/View';
import { HelperMeshes } from './HelperMeshes';
import { ICamera } from '../common/camera/ICamera';
import { Camera3D } from '../common/camera/Camera3D';
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


export class GameView extends View {
    static id = 'game-viewer';
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
        return GameView.id;
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
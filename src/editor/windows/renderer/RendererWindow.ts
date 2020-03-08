import { Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../../common/services/AbstractModelLoader';
import { IPointerService } from '../../common/services/IPointerService';
import { MouseService } from '../../common/services/MouseService';
import { UpdateService } from '../../common/services/UpdateServices';
import { CanvasViewSettings, WindowController } from '../../common/WindowController';
import { Editor } from '../../Editor';
import { ServiceLocator } from '../../ServiceLocator';
import { CanvasWindow } from '../canvas/CanvasWindow';
import { Tool } from '../canvas/tools/Tool';
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
import { RendererCameraTool } from './RendererCameraTool';
import { RendererPointerService } from './RendererPointerService';
import { WebglCanvasImporter } from './WebglCanvasImporter';
(<any> window).earcut = require('earcut');

export class RendererWindow extends WindowController {
    name = '3D View';
    static id = 'webgl-editor';
    visible = true;
    updateService: UpdateService;

    mouseHander: MouseService;

    writer: WebglCanvasImporter;
    modelLoader: AbstractModelLoader;
    pointer: IPointerService;
    private helperMeshes: HelperMeshes;

    camera: EditorCamera;
    cameraTool: RendererCameraTool;
    activeTool: Tool;

    private renderCanvasFunc: () => void;
    meshes: Mesh[] = [];

    constructor(editor: Editor, services: ServiceLocator) {
        super(editor, () => services, () => editor.stores);
        this.updateService = new UpdateService(this.editor, () => services, () => editor.stores);
        this.mouseHander = new MouseService(this);
        this.pointer = new RendererPointerService(this);
        this.update = this.update.bind(this);
    }

    getCamera(): EditorCamera {
        return this.cameraTool.getCamera();
    }

    resize() {
        this.getGameFacade().gameEngine.engine.resize();
    }

    setup() {
        this.cameraTool = new RendererCameraTool(this, this.getGameFacade().gameEngine.camera);
        this.activeTool = this.cameraTool;
        this.writer = new WebglCanvasImporter(this, this.getGameFacade());

        this.update();
    }

    update() {
        this.clearCanvas();
        if (this.writer) {
            const file = this.getServices().exportService().export();
            this.writer.import(file);
        }

        this.renderWindow();
    }


    getId(): string {
        return RendererWindow.id;
    }

    getActiveTool(): Tool {
        return this.activeTool;
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

    activate(): void {}

    private clearCanvas() {
        this.getGameFacade().clear();
    }

    
    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}
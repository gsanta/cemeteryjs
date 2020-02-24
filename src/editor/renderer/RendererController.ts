import { Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../common/services/AbstractModelLoader';
import { Tool } from '../canvas/tools/Tool';
import { AbstractCanvasController, CanvasViewSettings } from '../common/AbstractCanvasController';
import { IPointerService } from '../common/services/IPointerService';
import { MouseHandler } from '../common/services/MouseHandler';
import { Editor } from '../Editor';
import { Events } from "../common/Events";
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
import { RendererCameraTool } from './RendererCameraTool';
import { RendererPointerService } from './RendererPointerService';
import { WebglCanvasImporter } from './WebglCanvasImporter';
import { CanvasController } from '../canvas/CanvasController';
import { ServiceLocator } from '../ServiceLocator';
(<any> window).earcut = require('earcut');

export class RendererController extends AbstractCanvasController {
    name = '3D View';
    static id = 'webgl-editor';
    visible = true;

    mouseHander: MouseHandler;

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
        super(editor, services);
        this.mouseHander = new MouseHandler(this);
        this.pointer = new RendererPointerService(this);
        this.update = this.update.bind(this);
        this.registerEvents();
    }

    getCamera(): EditorCamera {
        return this.cameraTool.getCamera();
    }

    registerEvents() {
        this.editor.eventDispatcher.addEventListener(Events.CONTENT_CHANGED, this.update);
        this.editor.eventDispatcher.addEventListener(Events.CANVAS_ITEM_CHANGED, this.update);
    }

    unregisterEvents() {
        this.editor.eventDispatcher.removeEventListener(this.update);
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
            const file = (<CanvasController> this.editor.getWindowControllerByName('canvas')).exporter.export();
            this.writer.import(file);
        }

        this.renderWindow();
    }


    getId(): string {
        return RendererController.id;
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
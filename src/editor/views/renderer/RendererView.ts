import { Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../../AbstractModelLoader';
import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { UpdateService } from '../../services/UpdateServices';
import { Tool, ToolType } from '../canvas/tools/Tool';
import { IPointerHandler } from '../IPointerHandler';
import { MouseHandler } from '../MouseHandler';
import { CanvasViewSettings, View } from '../View';
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
import { RendererCameraTool } from './RendererCameraTool';
import { RendererPointerService } from './RendererPointerService';
import { WebglCanvasImporter } from './WebglCanvasImporter';
(<any> window).earcut = require('earcut');

export class RendererView extends View {
    name = '3D View';
    static id = 'webgl-editor';
    visible = true;
    updateService: UpdateService;

    mouseHander: MouseHandler;

    writer: WebglCanvasImporter;
    modelLoader: AbstractModelLoader;
    pointer: IPointerHandler;
    private helperMeshes: HelperMeshes;

    camera: EditorCamera;

    private renderCanvasFunc: () => void;
    meshes: Mesh[] = [];

    constructor(editor: Editor, services: ServiceLocator) {
        super(editor, () => services, () => editor.stores);

        this.updateService = new UpdateService(this.editor, () => services, () => editor.stores);
        this.mouseHander = new MouseHandler(this);
        this.pointer = new RendererPointerService(this, this.getStores);
        this.update = this.update.bind(this);
    }

    getCamera(): EditorCamera {
        return this.camera;
    }

    resize() {
        this.getGameFacade().gameEngine.engine.resize();
    }

    setup() {
        this.tools = [
            new RendererCameraTool(this, this.getGameFacade().gameEngine.camera)
        ]
        this.activeTool = this.getToolByType(ToolType.CAMERA);
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
        return RendererView.id;
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

    private clearCanvas() {
        this.getGameFacade().clear();
    }
    
    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}
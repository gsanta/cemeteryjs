import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { UpdateService } from '../../services/UpdateServices';
import { Tool, ToolType } from '../canvas/tools/Tool';
import { View } from '../View';
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
import { RendererCameraTool } from './RendererCameraTool';
(<any> window).earcut = require('earcut');

export class RendererView extends View {
    static id = 'webgl-editor';
    visible = true;
    updateService: UpdateService;

    private helperMeshes: HelperMeshes;

    private renderCanvasFunc: () => void;

    constructor(editor: Editor, services: ServiceLocator) {
        super(editor, () => services, () => editor.stores);

        this.updateService = new UpdateService(this.editor, () => services, () => editor.stores);
        this.update = this.update.bind(this);
    }

    getCamera(): EditorCamera {
        return this.getGameFacade().gameEngine.camera;
    }

    resize() {
        this.getGameFacade().gameEngine.engine.resize();
    }

    setup() {
        this.tools = [
            new RendererCameraTool(this, this.getServices, this.getStores)
        ]
        this.selectedTool = this.getToolByType(ToolType.CAMERA);

        this.update();
    }

    update() {
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
}
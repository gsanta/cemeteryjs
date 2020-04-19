import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { Tool } from '../../services/tools/Tool';
import { UpdateService } from '../../services/UpdateServices';
import { View } from '../View';
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
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
        return this.getServices().game.gameEngine.camera;
    }

    resize() {
        this.getServices().game.gameEngine.engine.resize();
    }

    setup() {
        this.selectedTool = this.getServices().tools.zoom;

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
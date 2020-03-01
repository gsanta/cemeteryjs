import { PathImporter } from './io/import/PathImporter';
import { MeshViewImporter } from './io/import/RectangleImporter';
import { CanvasImporter } from './io/import/CanvasImporter';
import { PathView } from './models/views/PathView';
import { Editor } from '../Editor';
import { MeshViewForm } from './forms/MeshViewForm';
import { PathViewForm } from './forms/PathViewForm';
import { AbstractCanvasController, CanvasViewSettings } from '../common/AbstractCanvasController';
import { ICamera } from '../common/models/ICamera';
import { CanvasPointerService } from './services/CanvasPointerService';
import { IPointerService } from '../common/services/IPointerService';
import { KeyboardHandler } from '../common/services/KeyboardHandler';
import { MouseHandler } from '../common/services/MouseHandler';
import { Model3DController } from './Model3DController';
import { ViewStore } from './models/ViewStore';
import { CameraTool } from './tools/CameraTool';
import { DeleteTool } from './tools/DeleteTool';
import { MoveTool } from './tools/MoveTool';
import { PathExporter } from './io/export/PathExporter';
import { PathTool } from './tools/PathTool';
import { PointerTool } from './tools/PointerTool';
import { RectangleExporter } from './io/export/RectangleExporter';
import { RectangleTool } from './tools/RectangleTool';
import { SelectTool } from './tools/SelectTool';
import { Tool, ToolType } from './tools/Tool';
import { ToolService } from './tools/ToolService';
import { CanvasExporter } from './io/export/CanvasExporter';
import { ServiceLocator } from '../ServiceLocator';
import { FeedbackStore } from './models/FeedbackStore';
import { Events } from '../common/Events';
import { CanvasUpdateService } from './services/CanvasUpdateServices';

export class CanvasController extends AbstractCanvasController {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;

    viewStore: ViewStore;
    feedbackStore: FeedbackStore;

    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    importer: CanvasImporter;
    exporter: CanvasExporter;
    model3dController: Model3DController;
    toolService: ToolService;
    updateService: CanvasUpdateService;
    pointer: IPointerService;
    
    meshViewForm: MeshViewForm;
    pathForm: PathViewForm;

    private renderCanvasFunc = () => null;

    private toolbarRenderers: Function[] = [];
    // private renderToolbarFunc = () => null;
    
    constructor(editor: Editor, services: ServiceLocator) {
        super(editor, services);

        this.updateService = new CanvasUpdateService(this, services);
        this.viewStore = new ViewStore();
        this.feedbackStore = new FeedbackStore();
        
        this.mouseController = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.importer = new CanvasImporter(
            [
                new MeshViewImporter(rect => this.viewStore.addRect(rect)),
                new PathImporter((path: PathView) => this.viewStore.addPath(path))
            ],
            this
        );
        this.exporter = new CanvasExporter(this, [new RectangleExporter(this), new PathExporter(this)]);
        this.model3dController = new Model3DController(this);

        this.toolService = new ToolService(this, this.services);

        this.meshViewForm = new MeshViewForm(this, this.services, this.editor.eventDispatcher);
        this.pathForm = new PathViewForm();
        this.pointer = new CanvasPointerService(this);
    }

    renderWindow() {
        this.renderCanvasFunc();
    }

    renderToolbar() {
        this.toolbarRenderers.forEach(renderer => renderer());
    }

    setSelectedTool(toolType: ToolType) {
        if (this.toolService.selectedTool) {
            this.toolService.getActiveTool().unselect();
        }
        this.toolService.selectedTool = toolType;
        this.toolService.getActiveTool().select();
        this.renderToolbar();
    }

    getId() {
        return CanvasController.id;
    }

    resize(): void {
        this.toolService.cameraTool.resize();
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    addToolbarRenderer(renderFunc: () => void): void {
        this.toolbarRenderers.push(renderFunc);
    }

    activate(): void {
        // this.
    }

    isEmpty(): boolean {
        return this.viewStore.getViews().length === 0;
    }

    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}
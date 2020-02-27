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

export class CanvasController extends AbstractCanvasController {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;

    viewStore: ViewStore;
    feedbackStore: FeedbackStore;

    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    tools: Tool[];
    cameraTool: CameraTool;
    pointerTool: PointerTool;
    moveTool: MoveTool;
    importer: CanvasImporter;
    exporter: CanvasExporter;
    model3dController: Model3DController;
    toolService: ToolService;
    pointer: IPointerService;
    
    meshViewForm: MeshViewForm;
    pathForm: PathViewForm;

    selectedTool = ToolType.RECTANGLE;

    private renderCanvasFunc = () => null;

    private toolbarRenderers: Function[] = [];
    // private renderToolbarFunc = () => null;
    
    constructor(editor: Editor, services: ServiceLocator) {
        super(editor, services);

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
        this.exporter = new CanvasExporter(this);
        this.model3dController = new Model3DController(this);
        
        this.pointerTool = new PointerTool(this);
        this.cameraTool = new CameraTool(this);
        const rectangleTool = new RectangleTool(this, this.editor.eventDispatcher);
        const pathTool = new PathTool(this);
        const deleteTool = new DeleteTool(this, this.editor.eventDispatcher);
        this.moveTool = new MoveTool(this, this.editor.eventDispatcher);
        const selectTool = new SelectTool(this);
        this.tools = [
            rectangleTool,
            pathTool,
            deleteTool,
            selectTool,
            this.cameraTool,
        ];

        this.toolService = new ToolService(
            [
                rectangleTool,
                pathTool,
                deleteTool,
                selectTool,
                this.cameraTool,
            ],
            [
                new RectangleExporter(this),
                new PathExporter(this)
            ]
        )

        this.meshViewForm = new MeshViewForm(this, this.services, this.editor.eventDispatcher);
        this.pathForm = new PathViewForm();
        this.pointer = new CanvasPointerService(this);
    }

    getCamera(): ICamera {
        return this.cameraTool.getCamera();
    }

    renderWindow() {
        this.renderCanvasFunc();
    }

    renderToolbar() {
        this.toolbarRenderers.forEach(renderer => renderer());
    }

    setSelectedTool(toolType: ToolType) {
        if (this.selectedTool) {
            this.getActiveTool().unselect();
        }
        this.selectedTool = toolType;
        this.getActiveTool().select();
        this.renderToolbar();
    }

    getActiveTool(): Tool {
        switch(this.selectedTool) {
            case ToolType.SELECT:
                return this.findToolByType(ToolType.SELECT);
            case ToolType.DELETE:
                return this.findToolByType(ToolType.DELETE);
            case ToolType.RECTANGLE:
                return this.findToolByType(ToolType.RECTANGLE);
            case ToolType.CAMERA:
                return this.findToolByType(ToolType.CAMERA);
            case ToolType.PATH:
                return this.findToolByType(ToolType.PATH);
        }
    }

    findToolByType(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }

    getId() {
        return CanvasController.id;
    }

    resize(): void {
        this.cameraTool.resize();
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
import { PathImporter } from '../../../../common/importers/PathImporter';
import { MeshViewImporter } from '../../../../common/importers/RectangleImporter';
import { ViewImporter } from '../../../../common/importers/ViewImporter';
import { PathView } from '../../../../common/views/PathView';
import { NamingService } from '../../../services/NamingService';
import { Controllers } from '../../Controllers';
import { MeshViewForm } from '../../forms/MeshViewForm';
import { PathViewForm } from '../../forms/PathViewForm';
import { AbstractCanvasController, CanvasViewSettings } from '../AbstractCanvasController';
import { ICamera } from '../ICamera';
import { ICanvasExporter } from '../ICanvasExporter';
import { ICanvasImporter } from '../ICanvasImporter';
import { ITagService } from '../ITagService';
import { CanvasPointerService } from '../services/CanvasPointerService';
import { HoverService } from '../services/HoverService';
import { IPointerService } from '../services/IPointerService';
import { KeyboardHandler } from '../services/KeyboardHandler';
import { MouseHandler } from '../services/MouseHandler';
import { Model3DController } from './Model3DController';
import { ViewStore } from './models/ViewStore';
import { SvgCanvasExporter } from './SvgCanvasExporter';
import { CameraTool } from './tools/CameraTool';
import { DeleteTool } from './tools/DeleteTool';
import { MoveTool } from './tools/MoveTool';
import { PathExporter } from './tools/path/PathExporter';
import { PathTool } from './tools/path/PathTool';
import { PointerTool } from './tools/PointerTool';
import { RectangleExporter } from './tools/rectangle/RectangleExporter';
import { RectangleTool } from './tools/rectangle/RectangleTool';
import { SelectTool } from './tools/SelectTool';
import { Tool, ToolType } from './tools/Tool';
import { ToolService } from './tools/ToolService';

export class CanvasController extends AbstractCanvasController {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;

    viewStore: ViewStore;

    nameingService: NamingService;

    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    tools: Tool[];
    cameraTool: CameraTool;
    pointerTool: PointerTool;
    moveTool: MoveTool;
    writer: ICanvasImporter;
    reader: ICanvasExporter;
    model3dController: Model3DController;
    toolService: ToolService;
    tagService: ITagService;
    hoverService: HoverService;
    pointer: IPointerService;
    
    meshViewForm: MeshViewForm;
    pathForm: PathViewForm;

    selectedTool = ToolType.RECTANGLE;

    private renderCanvasFunc = () => null;

    private toolbarRenderers: Function[] = [];
    // private renderToolbarFunc = () => null;
    
    constructor(services: Controllers) {
        super(services);

        this.viewStore = new ViewStore();
        this.nameingService = new NamingService(this);
        
        this.mouseController = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.writer = new ViewImporter(
            [
                new MeshViewImporter(rect => this.viewStore.addRect(rect)),
                new PathImporter((path: PathView) => this.viewStore.addPath(path))
            ],
            this
        );
        this.reader = new SvgCanvasExporter(this);
        this.model3dController = new Model3DController(this);
        
        this.pointerTool = new PointerTool(this);
        this.cameraTool = new CameraTool(services);
        const rectangleTool = new RectangleTool(this, this.controllers.eventDispatcher);
        const pathTool = new PathTool(this);
        const deleteTool = new DeleteTool(this, this.controllers.eventDispatcher);
        this.moveTool = new MoveTool(this, this.controllers.eventDispatcher);
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

        this.meshViewForm = new MeshViewForm(this, this.controllers.eventDispatcher);
        this.pathForm = new PathViewForm();
        this.tagService = this.viewStore;
        this.hoverService = new HoverService(this);
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
            this.getActiveTool().exit();
        }
        this.selectedTool = toolType;
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

    setVisible(visible: boolean) {
        this.visible = visible;
        if (!this.visible) { this.controllers.webglCanvasController.setVisible(true);}
        this.controllers.render();
    }

    isVisible(): boolean {
        return this.visible;
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
import { FileFormat } from '../../../../game/import/WorldGenerator';
import { EditorFacade } from '../../EditorFacade';
import { GameObjectForm } from '../../forms/GameObjectForm';
import { CanvasViewSettings, AbstractCanvasController } from '../AbstractCanvasController';
import { ICanvasExporter } from '../ICanvasExporter';
import { ICanvasImporter } from '../ICanvasImporter';
import { MouseHandler } from './handlers/MouseHandler';
import { Model3DController } from './Model3DController';
import { SvgCanvasExporter } from './SvgCanvasExporter';
import { ViewImporter } from '../../../../common/importers/ViewImporter';
import { CameraTool } from './tools/CameraTool';
import { DeleteTool } from './tools/DeleteTool';
import { MoveAndSelectTool } from './tools/MoveAndSelectTool';
import { PathExporter } from './tools/path/PathExporter';
import { PathImporter } from '../../../../common/importers/PathImporter';
import { RectangleExporter } from './tools/rectangle/RectangleExporter';
import { MeshViewImporter } from '../../../../common/importers/RectangleImporter';
import { RectangleTool } from './tools/rectangle/RectangleTool';
import { Tool, ToolType } from './tools/Tool';
import { ToolService } from './tools/ToolService';
import { PathForm } from '../../forms/PathForm';
import { GameObjectFormState } from '../../forms/GameObjectFormState';
import { PathView } from '../../../../common/views/PathView';
import { PathTool } from './tools/path/PathTool';
import { KeyboardHandler } from './handlers/KeyboardHandler';

export class CanvasController extends AbstractCanvasController {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;
    fileFormats = [FileFormat.SVG];
    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    tools: Tool[];
    cameraTool: CameraTool;
    writer: ICanvasImporter;
    reader: ICanvasExporter;
    model3dController: Model3DController;
    toolService: ToolService;
    
    services: EditorFacade;

    gameObjectForm: GameObjectForm;
    gameObjectFormState: GameObjectFormState;
    pathForm: PathForm;

    selectedTool = ToolType.RECTANGLE;

    private renderCanvasFunc = () => null;
    private renderToolbarFunc = () => null;
    
    constructor(services: EditorFacade) {
        super();

        this.services = services;
        
        this.mouseController = new MouseHandler(this.services);
        this.keyboardHandler = new KeyboardHandler(this);
        this.writer = new ViewImporter([
            new MeshViewImporter(rect => this.services.viewStore.addRect(rect)),
            new PathImporter((path: PathView) => this.services.viewStore.addPath(path))
        ]);
        this.reader = new SvgCanvasExporter(this);
        this.model3dController = new Model3DController(this);

        this.cameraTool = new CameraTool(services);
        const rectangleTool = new RectangleTool(this.services, this.services.eventDispatcher);
        const pathTool = new PathTool(this.services);
        const deleteTool = new DeleteTool(this.services, this.services.eventDispatcher);
        const moveAndSelectTool = new MoveAndSelectTool(this.services, this.services.eventDispatcher); 
        this.tools = [
            rectangleTool,
            pathTool,
            deleteTool,
            moveAndSelectTool,
            this.cameraTool,
        ];

        this.toolService = new ToolService(
            [
                rectangleTool,
                pathTool,
                deleteTool,
                moveAndSelectTool,
                this.cameraTool,
            ],
            [
                new RectangleExporter(this.services),
                new PathExporter(this.services)
            ]
        )

        this.gameObjectForm = new GameObjectForm(this.services, this.services.eventDispatcher);
        this.gameObjectFormState = new GameObjectFormState();
        this.pathForm = new PathForm();
    }

    renderCanvas() {
        this.renderCanvasFunc();
    }

    renderToolbar() {
        this.renderToolbarFunc();
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
            case ToolType.MOVE_AND_SELECT:
                return this.findToolByType(ToolType.MOVE_AND_SELECT);
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
        if (!this.visible) { this.services.webglCanvasController.setVisible(true);}
        this.services.render();
    }

    isVisible(): boolean {
        return this.visible;
    }

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    setToolbarRenderer(renderFunc: () => void): void {
        this.renderToolbarFunc = renderFunc;
    }

    activate(): void {
        // this.
    }

    isEmpty(): boolean {
        return this.services.viewStore.getViews().length === 0;
    }

    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}
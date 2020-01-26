import { FileFormat } from '../../../../WorldGenerator';
import { GameObjectTemplate } from '../../../../world_generator/services/GameObjectTemplate';
import { defaultWorldItemDefinitions } from '../../../defaultWorldItemDefinitions';
import { EditorFacade } from '../../EditorFacade';
import { CanvasItemSettingsForm } from '../../forms/CanvasItemSettingsForm';
import { ICanvasExporter } from '../ICanvasExporter';
import { ICanvasImporter } from '../ICanvasImporter';
import { IEditableCanvas } from '../IEditableCanvas';
import { MouseHandler } from './handlers/MouseHandler';
import { Model3DController } from './Model3DController';
import { SvgCanvasStore } from './models/SvgCanvasStore';
import { SvgConfig } from './models/SvgConfig';
import { SvgCanvasExporter } from './SvgCanvasExporter';
import { SvgCanvasImporter } from './SvgCanvasImporter';
import { DeleteTool } from './tools/DeleteTool';
import { MoveAndSelectTool } from './tools/MoveAndSelectTool';
import { RectangleTool } from './tools/rectangle/RectangleTool';
import { Tool, ToolType } from './tools/Tool';
import { CameraTool } from './tools/CameraTool';
import { PathTool } from './tools/path/PathTool';
import { ToolService } from './tools/ToolService';
import { RectangleExporter } from './tools/rectangle/RectangleExporter';
import { RectangleComponentFactory } from './tools/rectangle/RectangleComponentFactory';
import { PathExporter } from './tools/path/PathExporter';
import { PathComponentFactory } from './tools/path/PathComponentFactory';
import { RectangleImporter } from './tools/rectangle/RectangleImporter';

export class SvgCanvasController implements IEditableCanvas {
    static id = 'svg-canvas-controller';
    fileFormats = [FileFormat.SVG];
    mouseController: MouseHandler;
    tools: Tool[];
    cameraTool: CameraTool;
    writer: ICanvasImporter;
    reader: ICanvasExporter;
    model3dController: Model3DController;
    toolService: ToolService;

    configModel: SvgConfig;
    canvasStore: SvgCanvasStore;
    
    controllers: EditorFacade;
    worldItemDefinitions: GameObjectTemplate[];
    selectedWorldItemDefinition: GameObjectTemplate;

    canvasItemSettingsForm: CanvasItemSettingsForm;

    selectedTool = ToolType.RECTANGLE;

    private renderCanvasFunc = () => null;
    private renderToolbarFunc = () => null;
    private renderSettingsFunc = () => null;
    
    constructor(editorFacade: EditorFacade) {
        this.controllers = editorFacade;
        this.worldItemDefinitions = [...defaultWorldItemDefinitions];
        this.selectedWorldItemDefinition = this.worldItemDefinitions[0];

        this.configModel = new SvgConfig();
        this.canvasStore = new SvgCanvasStore(this.configModel);
        
        this.mouseController = new MouseHandler(this);
        this.writer = new SvgCanvasImporter(this, editorFacade.eventDispatcher);
        this.reader = new SvgCanvasExporter(this);
        this.model3dController = new Model3DController(this);

        this.cameraTool = new CameraTool(editorFacade);
        const rectangleTool = new RectangleTool(this, this.controllers.eventDispatcher);
        const pathTool = new PathTool(this);
        const deleteTool = new DeleteTool(this, this.controllers.eventDispatcher);
        const moveAndSelectTool = new MoveAndSelectTool(this, this.controllers.eventDispatcher); 
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
                new RectangleExporter(this),
                new PathExporter(this)
            ],
            [
                new RectangleImporter(this)
            ],
            [
                new RectangleComponentFactory(this),
                new PathComponentFactory(this)
            ]
        )

        this.canvasItemSettingsForm = new CanvasItemSettingsForm(this, this.controllers.eventDispatcher);
    }

    renderCanvas() {
        this.renderCanvasFunc();
    }

    renderToolbar() {
        this.renderToolbarFunc();
    }

    renderSettings() {
        this.renderSettingsFunc();
    }

    setActiveTool(toolType: ToolType) {
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
        return SvgCanvasController.id;
    }

    resize(): void {
        this.cameraTool.resize();
    };

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    setToolbarRenderer(renderFunc: () => void) {
        this.renderToolbarFunc = renderFunc;
    }

    setSettingsRenderer(renderFunc: () => void) {
        this.renderSettingsFunc = renderFunc;
    }

    activate(): void {
        // this.
    }

    setSelectedWorldItemDefinition(worldItemDefinition: GameObjectTemplate) {
        this.selectedWorldItemDefinition = worldItemDefinition;
        this.renderToolbar();
    }

    isEmpty(): boolean {
        return this.canvasStore.items.length === 0;
    }
}
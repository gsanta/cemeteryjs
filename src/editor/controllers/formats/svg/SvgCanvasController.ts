import { FileFormat } from '../../../../WorldGenerator';
import { GameObjectTemplate } from '../../../../world_generator/services/GameObjectTemplate';
import { defaultWorldItemDefinitions } from '../../../defaultWorldItemDefinitions';
import { ControllerFacade } from '../../ControllerFacade';
import { CanvasItemSettingsForm } from '../../forms/CanvasItemSettingsForm';
import { ICanvasReader } from '../ICanvasReader';
import { ICanvasWriter } from '../ICanvasWriter';
import { IEditableCanvas } from '../IEditableCanvas';
import { MouseHandler } from './handlers/MouseHandler';
import { Model3DController } from './Model3DController';
import { SvgCanvasStore } from './models/SvgCanvasStore';
import { SvgConfig } from './models/SvgConfig';
import { SvgCanvasReader } from './SvgCanvasReader';
import { SvgCanvasWriter } from './SvgCanvasWriter';
import { DeleteTool } from './tools/DeleteTool';
import { MoveAndSelectTool } from './tools/MoveAndSelectTool';
import { RectangleTool } from './tools/RectangleTool';
import { Tool, ToolType } from './tools/Tool';

export class SvgCanvasController implements IEditableCanvas {
    static id = 'svg-canvas-controller';
    fileFormats = [FileFormat.SVG];
    mouseController: MouseHandler;
    tools: Tool[];
    writer: ICanvasWriter;
    reader: ICanvasReader;
    model3dController: Model3DController;

    configModel: SvgConfig;
    pixelModel: SvgCanvasStore;
    
    controllers: ControllerFacade;
    worldItemDefinitions: GameObjectTemplate[];
    selectedWorldItemDefinition: GameObjectTemplate;

    canvasItemSettingsForm: CanvasItemSettingsForm;

    selectedTool = ToolType.RECTANGLE;

    private renderCanvasFunc = () => null;
    private renderToolbarFunc = () => null;
    private renderSettingsFunc = () => null;
    
    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.worldItemDefinitions = [...defaultWorldItemDefinitions];
        this.selectedWorldItemDefinition = this.worldItemDefinitions[0];

        this.configModel = new SvgConfig();
        this.pixelModel = new SvgCanvasStore(this.configModel);
        
        this.mouseController = new MouseHandler(this);
        this.writer = new SvgCanvasWriter(this, controllers.eventDispatcher);
        this.reader = new SvgCanvasReader(this);
        this.model3dController = new Model3DController(this);

        this.tools = [
            new RectangleTool(this, this.controllers.eventDispatcher),
            new DeleteTool(this, this.controllers.eventDispatcher),
            new MoveAndSelectTool(this, this.controllers.eventDispatcher)
        ];

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
        }
    }

    findToolByType(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }

    getId() {
        return SvgCanvasController.id;
    }

    resize(): void {};

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
        return this.pixelModel.items.length === 0;
    }
}
import { BitmapConfig as BitmapConfig } from './BitmapConfig';
import { MouseController } from './MouseController';
import { RectangleTool } from './tools/RectangleTool';
import { PixelModel } from './PixelModel';
import { ControllerFacade } from '../../ControllerFacade';
import { Tool, ToolType } from './tools/Tool';
import { DeleteTool } from './tools/DeleteTool';
import { SelectionModel } from './SelectionModel';
import { IEditorController } from '../IEditorController';
import { BitmapEditorModel } from './BitmapEditorModel';

export class BitmapEditorController implements IEditorController {
    static id = 'bitmap-editor';
    mouseController: MouseController;
    activeTool: Tool;
    tools: Tool[];
    controllers: ControllerFacade;
    model: BitmapEditorModel;

    configModel: BitmapConfig;
    pixelModel: PixelModel;

    selectionModel: SelectionModel;

    constructor(controllers: ControllerFacade) {
        this.selectionModel = new SelectionModel();
        this.configModel = new BitmapConfig();
        this.pixelModel = new PixelModel(this.configModel);
        
        this.mouseController = new MouseController(this);
        this.controllers = controllers;

        this.tools = [
            new RectangleTool(this),
            new DeleteTool(this)
        ];

        this.activeTool = this.tools[0];
    }

    updateUI() {
        this.controllers.updateUIController.updateUI();
    }

    setRendererDirty() {
        this.controllers.rendererController.isDirty = true;
    }

    setActiveTool(toolType: ToolType) {
        this.activeTool = this.tools.find(tool => tool.type === toolType);
        this.updateUI();
    }

    getId() {
        return BitmapEditorController.id;
    }

    resize(): void {};

    getModel() {
        return this.controllers.bitmapEditorModel;
    }
}
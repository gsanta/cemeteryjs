import { BitmapConfig as BitmapConfig } from './BitmapConfig';
import { MouseController } from './MouseController';
import { RectangleTool } from './tools/RectangleTool';
import { PixelController } from './PixelController';
import { ControllerFacade } from '../ControllerFacade';
import { Tool, ToolType } from './tools/Tool';
import { DeleteTool } from './tools/DeleteTool';
import { SelectionModel } from '../../models/bitmap_editor/SelectionModel';

export class BitmapEditor {
    config: BitmapConfig;
    mouseController: MouseController;
    pixelController: PixelController;
    activeTool: Tool;
    tools: Tool[];
    id: string;
    controllers: ControllerFacade;

    selectionModel: SelectionModel;

    constructor(controllers: ControllerFacade) {
        this.selectionModel = new SelectionModel();
        
        this.config = new BitmapConfig;
        this.mouseController = new MouseController(this);
        this.pixelController = new PixelController(this);
        this.controllers = controllers;

        this.tools = [
            new RectangleTool(this),
            new DeleteTool(this)
        ];

        this.activeTool = this.tools[0];

        this.id = 'bitmap-editor';
    }

    render() {
        this.controllers.renderController.render();
    }

    setActiveTool(toolType: ToolType) {
        this.activeTool = this.tools.find(tool => tool.type === toolType);
        this.render();
    }
}
import { DrawEditorConfig } from './DrawEditorConfig';
import { MouseController } from './MouseController';
import { RectangleTool } from './RectangleTool';


export class DrawEditorController {
    config: DrawEditorConfig;
    mouseController: MouseController;
    activeTool: RectangleTool;

    constructor() {
        this.config = new DrawEditorConfig;
        this.mouseController = new MouseController(this);
        this.activeTool = new RectangleTool();
    }
}
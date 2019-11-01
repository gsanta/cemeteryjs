import { BitmapConfig as BitmapConfig } from './BitmapConfig';
import { MouseController } from './MouseController';
import { RectangleTool } from './RectangleTool';
import { PixelController } from './PixelController';
import { ControllerFacade } from '../ControllerFacade';


export class BitmapEditor {
    config: BitmapConfig;
    mouseController: MouseController;
    pixelController: PixelController;
    activeTool: RectangleTool;
    id: string;
    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade) {
        this.config = new BitmapConfig;
        this.mouseController = new MouseController(this);
        this.activeTool = new RectangleTool(this);
        this.pixelController = new PixelController(this);
        this.controllers = controllers;

        this.id = 'bitmap-editor';
    }

    render() {
        this.controllers.renderController.render();
    }
}
import { IEditableCanvas } from './formats/IEditableCanvas';
import { SvgCanvasController } from './formats/svg/SvgCanvasController';
import { WebglCanvasController } from './formats/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';

export class ControllerFacade {
    webglCanvasController: WebglCanvasController;
    svgCanvasController: SvgCanvasController;
    
    editors: IEditableCanvas[];

    eventDispatcher: EventDispatcher;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.webglCanvasController = new WebglCanvasController(this);
        this.svgCanvasController = new SvgCanvasController(this);

    }
}
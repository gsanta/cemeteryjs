import { IEditableCanvas } from './canvases/IEditableCanvas';
import { SvgCanvasController } from './canvases/svg/SvgCanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';

export class EditorFacade {
    webglCanvasController: WebglCanvasController;
    svgCanvasController: SvgCanvasController;
    
    editors: IEditableCanvas[];

    eventDispatcher: EventDispatcher;

    svgCanvasId: string;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.webglCanvasController = new WebglCanvasController(this);
        this.svgCanvasController = new SvgCanvasController(this);

        this.svgCanvasId = 'svg-editor';

    }
}
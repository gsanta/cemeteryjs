import { SvgCanvasController } from './canvases/svg/SvgCanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';
import { ICanvasController } from './canvases/ICanvasController';

export class EditorFacade {
    webglCanvasController: WebglCanvasController;
    svgCanvasController: SvgCanvasController;
    
    eventDispatcher: EventDispatcher;

    svgCanvasId: string;
    renderFunc: () => void;

    canvases: ICanvasController[];

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.webglCanvasController = new WebglCanvasController(this);
        this.svgCanvasController = new SvgCanvasController(this);

        this.canvases = [this.svgCanvasController, this.webglCanvasController];

        this.svgCanvasId = 'svg-editor';
    }

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}
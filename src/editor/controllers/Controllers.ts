import { CanvasController } from './windows/canvas/CanvasController';
import { RendererController } from './windows/renderer/RendererController';
import { EventDispatcher } from './events/EventDispatcher';
import { AbstractCanvasController } from './windows/AbstractCanvasController';
import { GlobalSettingsForm } from './forms/GlobalSettingsForm';

export class Controllers {
    webglCanvasController: RendererController;
    svgCanvasController: CanvasController;
    
    eventDispatcher: EventDispatcher;

    svgCanvasId: string;
    renderFunc: () => void;

    canvases: AbstractCanvasController[];

    globalSettingsForm: GlobalSettingsForm;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.webglCanvasController = new RendererController(this);
        this.svgCanvasController = new CanvasController(this);

        this.canvases = [this.svgCanvasController, this.webglCanvasController];

        this.globalSettingsForm = new GlobalSettingsForm(this, this.eventDispatcher);

        this.svgCanvasId = 'svg-editor';
    }

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}
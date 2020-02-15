import { CanvasController } from './windows/canvas/CanvasController';
import { WebglCanvasController } from './windows/renderer/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';
import { AbstractCanvasController } from './windows/AbstractCanvasController';
import { GlobalSettingsForm } from './forms/GlobalSettingsForm';
import { ViewStore } from './windows/canvas/models/ViewStore';
import { NamingService } from '../services/NamingService';

export class EditorFacade {
    webglCanvasController: WebglCanvasController;
    svgCanvasController: CanvasController;
    
    eventDispatcher: EventDispatcher;

    svgCanvasId: string;
    renderFunc: () => void;

    canvases: AbstractCanvasController[];

    globalSettingsForm: GlobalSettingsForm;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.webglCanvasController = new WebglCanvasController(this);
        this.svgCanvasController = new CanvasController(this);

        this.canvases = [this.svgCanvasController, this.webglCanvasController];

        this.globalSettingsForm = new GlobalSettingsForm(this);

        this.svgCanvasId = 'svg-editor';
    }

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}
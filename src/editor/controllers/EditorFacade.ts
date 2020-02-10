import { CanvasController } from './canvases/svg/CanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';
import { AbstractCanvasController } from './canvases/AbstractCanvasController';
import { GlobalSettingsForm } from './forms/GlobalSettingsForm';
import { ViewStore } from './canvases/svg/models/ViewStore';
import { NamingService } from '../services/NamingService';

export class EditorFacade {
    webglCanvasController: WebglCanvasController;
    svgCanvasController: CanvasController;
    
    eventDispatcher: EventDispatcher;

    svgCanvasId: string;
    renderFunc: () => void;

    canvases: AbstractCanvasController[];

    globalSettingsForm: GlobalSettingsForm;

    viewStore: ViewStore;

    nameingService: NamingService;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.webglCanvasController = new WebglCanvasController(this);
        this.svgCanvasController = new CanvasController(this);

        this.viewStore = new ViewStore();

        this.nameingService = new NamingService(this);

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
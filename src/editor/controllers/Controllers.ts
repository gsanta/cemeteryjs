import { CanvasController } from './windows/canvas/CanvasController';
import { RendererController } from './windows/renderer/RendererController';
import { EventDispatcher } from './events/EventDispatcher';
import { AbstractCanvasController } from './windows/AbstractCanvasController';
import { GlobalSettingsForm } from './forms/GlobalSettingsForm';
import { GameFacade } from '../../game/GameFacade';
import { GameApi } from '../../game/GameApi';

export class Controllers {
    webglCanvasController: RendererController;
    svgCanvasController: CanvasController;
    gameFacade: GameFacade;
    gameApi: GameApi;
    
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

    setup(canvas: HTMLCanvasElement) {
        this.gameFacade = new GameFacade(canvas);
        this.gameFacade.setup();
        this.gameApi = new GameApi(this.gameFacade);
        this.webglCanvasController.setup();
    }

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}
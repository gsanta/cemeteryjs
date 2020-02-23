import { GameApi } from '../game/GameApi';
import { GameFacade } from '../game/GameFacade';
import { CanvasFactory } from './canvas/CanvasFactory';
import { GlobalSettingsForm } from './canvas/forms/GlobalSettingsForm';
import { AbstractCanvasController } from './common/AbstractCanvasController';
import { EventDispatcher } from './common/EventDispatcher';
import { RendererFactory } from './renderer/RendererFactory';
import { WindowFactory } from './WindowFactory';
import { CanvasController } from './canvas/CanvasController';

export class Controllers {
    gameFacade: GameFacade;
    gameApi: GameApi;
    
    eventDispatcher: EventDispatcher;

    svgCanvasId: string;
    renderFunc: () => void;

    globalSettingsForm: GlobalSettingsForm;

    windowFactories: WindowFactory[];

    constructor() {
        this.windowFactories = [
            new CanvasFactory(),
            new RendererFactory()
        ]
        this.eventDispatcher = new EventDispatcher();

        this.globalSettingsForm = new GlobalSettingsForm(this.getWindowControllerByName('canvas') as CanvasController, this.eventDispatcher);

        this.svgCanvasId = 'svg-editor';
    }

    setup(canvas: HTMLCanvasElement) {
        this.gameFacade = new GameFacade(canvas);
        this.gameFacade.setup();
        this.gameApi = new GameApi(this.gameFacade);

        this.windowFactories.forEach(factory => factory.getWindowController(this).setup());
    }

    getWindowControllerByName(name: string) {
        return this.windowFactories.find(factory => factory.name === name).getWindowController(this);
    }

    getWindowControllers() {
        return this.windowFactories.map(factory => factory.getWindowController(this));
    }

    getWindowFactory(name: string) {
        return this.windowFactories.find(factory => factory.name === name);
    }

    setWindowVisibility(name: string, isVisible: boolean) {
        this.getWindowControllerByName(name).setVisible(isVisible);
        if (!this.getWindowControllers().find(controller => controller.isVisible())) {

            const defaultWindows = [this.getWindowControllerByName('renderer'), this.getWindowControllerByName('canvas')];

            defaultWindows.find(window => window.name !== name).setVisible(true);
        }
        this.render();
    }

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}
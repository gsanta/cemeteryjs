import { GameApi } from '../game/GameApi';
import { GameFacade } from '../game/GameFacade';
import { CanvasFactory } from './canvas/CanvasFactory';
import { GlobalSettingsForm } from './canvas/forms/GlobalSettingsForm';
import { EventDispatcher } from './common/EventDispatcher';
import { RendererFactory } from './renderer/RendererFactory';
import { WindowFactory } from './WindowFactory';
import { CanvasController } from './canvas/CanvasController';
import { LocalStore } from './services/LocalStrore';
import { ServiceLocator } from './ServiceLocator';

export class Editor {
    gameFacade: GameFacade;
    gameApi: GameApi;
    
    windowFactories: WindowFactory[];
    
    eventDispatcher: EventDispatcher;

    svgCanvasId: string;
    renderFunc: () => void;
    globalSettingsForm: GlobalSettingsForm;
    isLoading = true;

    private services: ServiceLocator;

    constructor(eventDispatcher: EventDispatcher) {
        this.services = new ServiceLocator(this, eventDispatcher);
        
        this.windowFactories = [
            new CanvasFactory(),
            new RendererFactory()
        ];


        this.eventDispatcher = eventDispatcher;

        this.globalSettingsForm = new GlobalSettingsForm(this.getWindowControllerByName('canvas') as CanvasController, this.eventDispatcher);

        this.svgCanvasId = 'svg-editor';
    }

    setup(canvas: HTMLCanvasElement) {
        this.gameFacade = new GameFacade(canvas, this.services);
        this.gameFacade.setup();
        this.gameApi = new GameApi(this.gameFacade);

        this.windowFactories.forEach(factory => factory.getWindowController(this, this.services).setup());
        this.services.storageService().loadEditorState()
            .then((str: string) => {
                (this.getWindowControllerByName('canvas') as CanvasController).importer.import(str);
                this.isLoading = false;
                this.render();
            })
            .catch(() => {
                this.isLoading = false;
                this.render();
            });
    }

    getWindowControllerByName(name: string) {
        return this.windowFactories.find(factory => factory.name === name).getWindowController(this, this.services);
    }

    getWindowControllers() {
        return this.windowFactories.map(factory => factory.getWindowController(this, this.services));
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
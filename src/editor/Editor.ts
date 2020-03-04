import { GameApi } from '../game/GameApi';
import { GameFacade } from '../game/GameFacade';
import { CanvasFactory } from './windows/canvas/CanvasFactory';
import { GlobalSettingsForm } from './windows/canvas/forms/GlobalSettingsForm';
import { EventDispatcher } from './common/EventDispatcher';
import { RendererFactory } from './windows/renderer/RendererFactory';
import { WindowFactory } from './WindowFactory';
import { CanvasWindow } from './windows/canvas/CanvasWindow';
import { ServiceLocator } from './ServiceLocator';
import { Stores } from './Stores';

export class Editor {
    gameFacade: GameFacade;
    gameApi: GameApi;

    stores: Stores;
    
    windowFactories: WindowFactory[];
    eventDispatcher: EventDispatcher;

    svgCanvasId: string;
    renderFunc: () => void;
    globalSettingsForm: GlobalSettingsForm;
    isLoading = true;

    private services: ServiceLocator;

    constructor(eventDispatcher: EventDispatcher) {
        this.stores = new Stores();
        this.services = new ServiceLocator(this, eventDispatcher, () => this.stores);

        this.windowFactories = [
            new CanvasFactory(),
            new RendererFactory()
        ];


        this.eventDispatcher = eventDispatcher;

        this.globalSettingsForm = new GlobalSettingsForm(this.getWindowControllerByName('canvas') as CanvasWindow, () => this.stores);

        this.svgCanvasId = 'svg-editor';
    }

    setup(canvas: HTMLCanvasElement) {
        this.gameFacade = new GameFacade(canvas, this.services);
        this.gameFacade.setup();
        this.gameApi = new GameApi(this.gameFacade);

        this.windowFactories.forEach(factory => factory.getWindowController(this, this.services, this.stores).setup());
        
        this.services.storageService().loadLevelIndexes()
            .then((indexes: number[]) => {
                if (indexes.length) {
                    this.stores.levelStore.setLevels(indexes);
                    return this.services.storageService().loadLevel(indexes[0]);
                }
            })
            .then(() => {
                this.isLoading = false;
                this.render();
            })
            .catch(() => {
                this.isLoading = false;
                this.render();
            });
    }

    getWindowControllerByName(name: string) {
        return this.windowFactories.find(factory => factory.name === name).getWindowController(this, this.services, this.stores);
    }

    getWindowControllers() {
        return this.windowFactories.map(factory => factory.getWindowController(this, this.services, this.stores));
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
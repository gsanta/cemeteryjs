import { GameService } from '../game/GameService';
import { GameFacade } from '../game/GameFacade';
import { CanvasFactory } from './views/canvas/CanvasFactory';
import { GlobalSettings } from './views/canvas/settings/GlobalSettings';
import { RendererFactory } from './views/renderer/RendererFactory';
import { ViewFactory } from './ViewFactory';
import { CanvasView } from './views/canvas/CanvasView';
import { ServiceLocator } from './services/ServiceLocator';
import { Stores } from './stores/Stores';

export class Editor {
    gameFacade: GameFacade;
    gameApi: GameService;

    stores: Stores;
    
    windowFactories: ViewFactory[];

    svgCanvasId: string;
    renderFunc: () => void;
    globalSettingsForm: GlobalSettings;
    isLoading = true;

    services: ServiceLocator;

    constructor() {
        this.svgCanvasId = 'svg-editor';
        this.stores = new Stores();
        this.services = new ServiceLocator(this, () => this.stores);

        this.windowFactories = [
            new CanvasFactory(),
            new RendererFactory()
        ];

        this.globalSettingsForm = new GlobalSettings(this.getWindowControllerByName('canvas') as CanvasView, () => this.services, () => this.stores);

    }

    setup(canvas: HTMLCanvasElement) {
        this.gameFacade = new GameFacade(canvas, this.services);
        this.gameFacade.setup();
        this.gameApi = new GameService(this.gameFacade);

        this.services.services.push(this.gameApi);

        this.windowFactories.forEach(factory => factory.getWindowController(this, this.services, this.stores).setup());
        
        this.services.storageService().loadLevelIndexes()
            .then((indexes: number[]) => {
                if (indexes.length) {
                    this.stores.levelStore.setLevels(indexes);
                    return this.services.levelService().changeLevel(indexes[0]);
                }
            })
            .then(() => {
                this.isLoading = false;
                this.services.historyService().saveState(this.services.exportService().export());
                this.render();
            })
            .catch(() => {
                this.isLoading = false;
                this.services.historyService().saveState(this.services.exportService().export());
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
import { Registry } from './Registry';
import { ViewFactory } from './ViewFactory';
import { CanvasFactory } from './views/canvas/CanvasFactory';
import { GlobalSettings } from './views/canvas/settings/GlobalSettings';
import { RendererFactory } from './views/renderer/RendererFactory';

export class Editor {
    registry: Registry;
    
    windowFactories: ViewFactory[];

    svgCanvasId: string;
    renderFunc: () => void;
    globalSettingsForm: GlobalSettings;
    isLoading = true;


    constructor() {
        this.svgCanvasId = 'svg-editor';
        this.registry = new Registry();
        this.registry.services.tools.tools.forEach(tool => tool.setup());

        this.windowFactories = [
            new CanvasFactory(),
            new RendererFactory()
        ];

        this.globalSettingsForm = new GlobalSettings(this.registry);

    }

    setup(canvas: HTMLCanvasElement) {
        this.windowFactories.forEach(factory => factory.getWindowController(this.registry));
        
        this.registry.services.storage.loadLevelIndexes()
            .then((indexes: number[]) => {
                if (indexes.length) {
                    this.registry.stores.levelStore.setLevels(indexes);
                    return this.registry.services.level.changeLevel(indexes[0]);
                }
            })
            .then(() => {
                this.isLoading = false;
                this.registry.services.history.saveState(this.registry.services.export.export());
                this.render();
            })
            .catch(() => {
                this.isLoading = false;
                this.registry.services.history.saveState(this.registry.services.export.export());
                this.render();
            });
    }

    getWindowControllerByName(name: string) {
        return this.windowFactories.find(factory => factory.name === name).getWindowController(this.registry);
    }

    getWindowControllers() {
        return this.windowFactories.map(factory => factory.getWindowController(this.registry));
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
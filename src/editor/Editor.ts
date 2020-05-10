import { Registry } from './Registry';
import { GlobalSettings } from '../plugins/scene_editor/settings/GlobalSettings';
import { LayoutSettings } from '../plugins/scene_editor/settings/LayoutSettings';

export class Editor {
    registry: Registry;
    
    svgCanvasId: string;
    renderFunc: () => void;
    globalSettingsForm: GlobalSettings;
    layoutSettings: LayoutSettings;
    isLoading = true;

    constructor() {
        this.svgCanvasId = 'svg-editor';
        this.registry = new Registry();
        this.registry.services.tools.tools.forEach(tool => tool.setup());

        this.globalSettingsForm = new GlobalSettings(this.registry);
        this.layoutSettings = new LayoutSettings(this.registry);
    }

    setup(canvas: HTMLCanvasElement) {        
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

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}
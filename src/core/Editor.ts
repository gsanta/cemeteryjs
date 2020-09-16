import { Registry } from './Registry';

export class Editor {
    registry: Registry;
    
    svgCanvasId: string;
    renderFunc: () => void;
    isLoading = true;

    constructor() {
        this.svgCanvasId = 'svg-editor';
        this.registry = new Registry();
    }

    setup(canvas: HTMLCanvasElement) {        
        this.registry.services.localStore.loadLevelIndexes()
            .then((indexes: number[]) => {
                if (indexes.length) {
                    this.registry.stores.levelStore.setLevels(indexes);
                    return this.registry.services.level.changeLevel(indexes[0]);
                }
            })
            .then(() => {
                this.isLoading = false;
                this.registry.services.history.createSnapshot();
                this.render();
            })

            .catch(() => {
                this.isLoading = false;
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
import { Registry } from './Registry';
import { ObjLifeCycleHook } from './stores/ObjStore';
import { AxisControlHook, ViewLifeCycleHook } from './stores/ViewStore';

export class Editor {
    registry: Registry;
    
    svgCanvasId: string;
    renderFunc: () => void;
    isLoading = true;

    constructor() {
        this.svgCanvasId = 'svg-editor';
        this.registry = new Registry();
        this.registry.stores.objStore.addHook(new ObjLifeCycleHook(this.registry));

        this.registry.stores.viewStore.addHook(new ViewLifeCycleHook(this.registry));
        this.registry.stores.viewStore.addHook(new AxisControlHook());
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
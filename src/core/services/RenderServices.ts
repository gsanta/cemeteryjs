import { Registry } from '../Registry';
import { UI_Region } from '../plugin/UI_Panel';

export enum RenderTask {
    RenderFocusedView = 'RenderFocusedView',
    RenderVisibleViews = 'RenderVisibleViews', 
    RenderSidebar = 'RenderSidebar',
    RenderDialog = 'RenderDialog',
    RenderFull = 'RenderFull',
}

export class RenderService {
    updateTasks: RenderTask[] = [];

    private renderers: Map<UI_Region, Function> = new Map();
    private rootRenderer: Function;
    private scheduledRenderers: Set<UI_Region> = new Set();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    reRenderAll() {
        this.rootRenderer();
    }


    reRender(...regions: UI_Region[]) {
        regions.filter(region => region).forEach(region => this.renderers.get(region)());
    }

    reRenderScheduled() {
        if (this.scheduledRenderers.size) {
            this.reRender(...Array.from(this.scheduledRenderers));
            this.scheduledRenderers = new Set();
        }
    }

    scheduleRendering(...regions: UI_Region[]) {
        regions.forEach(region => this.scheduledRenderers.add(region));
    }

    setRenderer(region: UI_Region, renderer: Function) {
        this.renderers.set(region, renderer);
    }

    setRootRenderer(renderer: Function) {
        this.rootRenderer = renderer;
    }
}
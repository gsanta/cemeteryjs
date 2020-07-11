import { UI_Region } from '../UI_Plugin';
import { UI_Layout } from '../gui_builder/elements/UI_Layout';

export class UI_Service {
    private ui_layouts: Map<UI_Region, UI_Layout[]> = new Map();
    private ui_rendererFuncs: Map<UI_Region, Function> = new Map();

    private scheduledRegionUpdates: UI_Region[] = [];


    constructor() {
        UI_Region.all().forEach(region => {
            this.ui_layouts.set(region, []);
            this.ui_rendererFuncs.set(region, () => {});
        });
    }

    setRendererFunc(region: UI_Region, rendererFunc: Function) {
        this.ui_rendererFuncs.set(region, rendererFunc);
    }

    scheduleUpdate(...regions: UI_Region[]) {
        this.scheduledRegionUpdates = regions;
    }

    runUpdate(...regions: UI_Region[]) {
        regions.forEach(region => this.ui_rendererFuncs.get(region)());
    }

    runScheduledUpdate() {
        this.runUpdate(...this.scheduledRegionUpdates)
        this.scheduledRegionUpdates = [];
    }
}
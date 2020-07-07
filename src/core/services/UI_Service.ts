import { UI_Layout } from '../gui_builder/UI_Element';
import { UI_Region, UI_Plugin } from '../UI_Plugin';

export class UI_Service {
    private registered_ui_plugins: Map<UI_Region, UI_Plugin[]> = new Map();
    private visible_ui_plugins: Map<UI_Region, UI_Plugin[]> = new Map();
    private ui_layouts: Map<UI_Region, UI_Layout[]> = new Map();
    private ui_renderers: Map<UI_Region, Function> = new Map();

    private scheduledRegionUpdates: UI_Region[] = [];


    constructor() {
        UI_Region.all().forEach(region => {
            this.registered_ui_plugins.set(region, []);
            this.visible_ui_plugins.set(region, []);
            this.ui_layouts.set(region, []);
            this.ui_renderers.set(region, () => {});
        });
    }

    register_UI_Plugin(ui_plugin: UI_Plugin) {
        this.registered_ui_plugins.get(ui_plugin.region).push(ui_plugin);
    }

    setRegionRenderer(region: UI_Region, renderer: Function) {
        this.ui_renderers.set(region, renderer);
    }

    scheduleRegionUpdate(...regions: UI_Region[]) {
        this.scheduledRegionUpdates = regions;
    }

    runRegionUpdate(...regions: UI_Region[]) {
        regions.forEach(region => this.ui_renderers.get(region)());
    }

    runScheduledRegionUpdate() {
        this.runRegionUpdate(...this.scheduledRegionUpdates)
        this.scheduledRegionUpdates = [];
    }
}
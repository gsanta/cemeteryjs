import { Registry } from '../Registry';
import { UI_Region } from '../UI_Plugin';

export enum RenderTask {
    RenderFocusedView = 'RenderFocusedView',
    RenderVisibleViews = 'RenderVisibleViews', 
    RenderSidebar = 'RenderSidebar',
    RenderDialog = 'RenderDialog',
    RenderFull = 'RenderFull',
}

export class RenderService {
    serviceName = 'render-service';
    updateTasks: RenderTask[] = [];

    private renderers: Map<UI_Region, Function> = new Map();
    private scheduledRenderers: Set<UI_Region> = new Set();

    private settingsRepainters: Function[] = [];
    private fullRepainter: Function;
    private dialogRenderer: Function;
    private primaryPanelRenderer: Function;
    private secondaryPanelRenderer: Function;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
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

    scheduleTasks(...tasks: RenderTask[]) {
        this.updateTasks = tasks;
    }

    runImmediately(...tasks: RenderTask[]) {
        this.runTasks(tasks);
    }

    runScheduledTasks() {
        this.runTasks(this.updateTasks);
        this.updateTasks = [];
    }


    private runTasks(tasks: RenderTask[]) {
        tasks.forEach(task => {
            switch(task) {
                case RenderTask.RenderFocusedView:
                    this.registry.plugins.getHoveredView() && this.registry.plugins.getHoveredView().reRender();
                break;
                case RenderTask.RenderSidebar:
                    this.settingsRepainters.forEach(repaint => repaint());
                break;
                case RenderTask.RenderVisibleViews:
                    this.registry.plugins.getActivePlugins().forEach(plugin => plugin.render());
                break;
                case RenderTask.RenderFull:
                    this.fullRepainter();
                break;
                case RenderTask.RenderDialog:
                    this.dialogRenderer();
                break;
            }
        });
    }

    setFullRepainter(repaint: Function) {
        this.fullRepainter = repaint;
    }

    addSettingsRepainter(repaint: Function) {
        this.settingsRepainters.push(repaint);
    }

    setDialogRenderer(dialogRenderer: Function) {
        this.dialogRenderer = dialogRenderer;
    }

    setPrimaryPanelRenderer(renderer: Function) {
        this.primaryPanelRenderer = renderer;
    }

    setSecondaryPanelRenderer(renderer: Function) {
        this.secondaryPanelRenderer = renderer;
    }
}
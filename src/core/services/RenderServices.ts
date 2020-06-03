import { Registry } from '../Registry';
import { GameViewerPlugin } from "../../plugins/game_viewer/GameViewerPlugin";

export enum RenderTask {
    RenderFocusedView = 'RenderFocusedView',
    RenderVisibleViews = 'RenderVisibleViews', 
    RenderSidebar = 'RenderSidebar',
    RenderFull = 'RenderFull'
}

export class RenderService {
    serviceName = 'render-service';
    updateTasks: RenderTask[] = [];

    private canvasRepainter: Function = () => undefined;
    private settingsRepainters: Function[] = [];
    private fullRepainter: Function;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
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
                    this.registry.services.plugin.getHoveredView().reRender();
                break;
                case RenderTask.RenderSidebar:
                    this.settingsRepainters.forEach(repaint => repaint());
                break;
                case RenderTask.RenderVisibleViews:
                    this.registry.services.plugin.plugins.forEach(plugin => plugin.reRender());
                break;
                case RenderTask.RenderFull:
                    this.fullRepainter();
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
}
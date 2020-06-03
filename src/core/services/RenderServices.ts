import { Registry } from '../Registry';
import { GameViewerPlugin } from "../../plugins/game_viewer/GameViewerPlugin";

export enum RenderTask {
    RepaintCanvas = 'RepaintCanvas',
    RenderFocusedView = 'RenderFocusedView',
    RepaintSettings = 'RepaintSettings',
    UpdateRenderer = 'UpdateRenderer',
    All = 'All',
    RenderFull = 'RenderFull',
}

export class RenderService {
    serviceName = 'update-service';
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
                case RenderTask.RepaintCanvas:
                    this.canvasRepainter();
                break;
                case RenderTask.RenderFocusedView:
                    this.registry.services.plugin.getHoveredView().repainter();
                break;
                case RenderTask.RepaintSettings:
                    this.settingsRepainters.forEach(repaint => repaint());
                break;
                case RenderTask.All:
                    this.canvasRepainter();
                    this.settingsRepainters.forEach(repaint => repaint());
                    this.registry.services.plugin.getViewById(GameViewerPlugin.id).update();
                break;
                case RenderTask.RenderFull:
                    this.fullRepainter();
                break;
            }
        });
    }

    private saveData() {
        this.registry.services.history.createSnapshot();
    }

    setCanvasRepainter(repaint: Function) {
        this.canvasRepainter = repaint;
    }

    setFullRepainter(repaint: Function) {
        this.fullRepainter = repaint;
    }

    addSettingsRepainter(repaint: Function) {
        this.settingsRepainters.push(repaint);
    }
}
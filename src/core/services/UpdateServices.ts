import { Registry } from '../Registry';
import { GameViewerPlugin } from "../../plugins/game_viewer/GameViewerPlugin";

export enum UpdateTask {
    RepaintCanvas = 'RepaintCanvas',
    RepaintActiveView = 'RepaintActiveView',
    RepaintSettings = 'RepaintSettings',
    UpdateRenderer = 'UpdateRenderer',
    SaveData = 'SaveData',
    All = 'All',
    Full = 'Full',
}

export class UpdateService {
    serviceName = 'update-service';
    updateTasks: UpdateTask[] = [];

    private canvasRepainter: Function = () => undefined;
    private settingsRepainters: Function[] = [];
    private fullRepainter: Function;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }


    scheduleTasks(...tasks: UpdateTask[]) {
        this.updateTasks = tasks;
    }

    runImmediately(...tasks: UpdateTask[]) {
        this.runTasks(tasks);
    }

    runScheduledTasks() {
        this.runTasks(this.updateTasks);
        this.updateTasks = [];
    }

    private runTasks(tasks: UpdateTask[]) {
        tasks.forEach(task => {
            switch(task) {
                case UpdateTask.RepaintCanvas:
                    this.canvasRepainter();
                break;
                case UpdateTask.RepaintActiveView:
                    this.registry.services.plugin.getHoveredView().repainter();
                break;
                case UpdateTask.RepaintSettings:
                    this.settingsRepainters.forEach(repaint => repaint());
                break;
                case UpdateTask.SaveData:
                    this.saveData();
                break;
                case UpdateTask.All:
                    this.canvasRepainter();
                    this.settingsRepainters.forEach(repaint => repaint());
                    this.registry.services.plugin.getViewById(GameViewerPlugin.id).update();
                break;
                case UpdateTask.Full:
                    this.fullRepainter();
                break;
            }
        });
    }

    private saveData() {
        const map = this.registry.services.export.export();
        this.registry.services.storage.storeLevel(this.registry.stores.levelStore.currentLevel.index, map);
        this.registry.services.history.saveState(map);
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
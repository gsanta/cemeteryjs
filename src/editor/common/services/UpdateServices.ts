import { CanvasWindow } from "../../windows/canvas/CanvasWindow";
import { ServiceLocator } from "../../ServiceLocator";
import { Events } from "../Events";
import { WindowController } from "../WindowController";
import { Stores } from '../../Stores';

export enum UpdateTask {
    RepaintCanvas = 'RepaintCanvas',
    RepaintSettings = 'RepaintSettings',
    UpdateRenderer = 'UpdateRenderer',
    SaveData = 'SaveData',
    All = 'All'
}

export class UpdateService {
    updateTasks: UpdateTask[] = [];

    private canvasRepainter: Function = () => undefined;
    private settingsRepainters: Function[] = [];

    private controller: WindowController;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(controller: WindowController, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;
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
                case UpdateTask.RepaintSettings:
                    this.settingsRepainters.forEach(repaint => repaint());
                break;
                case UpdateTask.UpdateRenderer:
                    this.controller.editor.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
                break;
                case UpdateTask.SaveData:
                    this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index);
                break;
                case UpdateTask.All:
                    this.canvasRepainter();
                    this.settingsRepainters.forEach(repaint => repaint());
                    this.controller.editor.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
                break;
            }
        });
    }

    setCanvasRepainter(repaint: Function) {
        this.canvasRepainter = repaint;
    }

    addSettingsRepainter(repaint: Function) {
        this.settingsRepainters.push(repaint);
    }
}
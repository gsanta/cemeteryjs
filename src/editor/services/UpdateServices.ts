import { Editor } from '../Editor';
import { ServiceLocator } from "./ServiceLocator";
import { Stores } from '../stores/Stores';
import { CanvasWindow } from "../windows/canvas/CanvasWindow";
import { RendererWindow } from "../windows/renderer/RendererWindow";

export enum UpdateTask {
    RepaintCanvas = 'RepaintCanvas',
    RepaintSettings = 'RepaintSettings',
    UpdateRenderer = 'UpdateRenderer',
    SaveData = 'SaveData',
    All = 'All'
}

export class UpdateService {
    serviceName = 'update-service';
    updateTasks: UpdateTask[] = [];

    private canvasRepainter: Function = () => undefined;
    private settingsRepainters: Function[] = [];

    private editor: Editor;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.editor = editor;
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
                    (<RendererWindow> this.editor.getWindowControllerByName('renderer')).update();
                break;
                case UpdateTask.SaveData:
                    const map = this.getServices().exportService().export();
                    this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index, map);
                    this.getServices().historyService().saveState(map);
                break;
                case UpdateTask.All:
                    this.canvasRepainter();
                    this.settingsRepainters.forEach(repaint => repaint());
                    (<RendererWindow> this.editor.getWindowControllerByName('renderer')).update();
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
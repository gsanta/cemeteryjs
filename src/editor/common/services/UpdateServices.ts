import { CanvasWindow } from "../../windows/canvas/CanvasWindow";
import { ServiceLocator } from "../../ServiceLocator";
import { Events } from "../Events";
import { WindowController } from "../WindowController";
import { Stores } from '../../Stores';
import { RendererWindow } from "../../windows/renderer/RendererWindow";
import { Editor } from '../../Editor';

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
                    this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index);
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
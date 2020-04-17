import { Editor } from '../Editor';
import { ServiceLocator } from "./ServiceLocator";
import { Stores } from '../stores/Stores';
import { RendererView } from "../views/renderer/RendererView";

export enum UpdateTask {
    RepaintCanvas = 'RepaintCanvas',
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
                case UpdateTask.SaveData:
                    this.saveData();
                break;
                case UpdateTask.All:
                    this.canvasRepainter();
                    this.settingsRepainters.forEach(repaint => repaint());
                    (<RendererView> this.editor.getWindowControllerByName('renderer')).update();
                break;
                case UpdateTask.Full:
                    this.fullRepainter();
                break;
            }
        });
    }

    private saveData() {
        const map = this.getServices().export.export();
        this.getServices().storage.storeLevel(this.getStores().levelStore.currentLevel.index, map);
        this.getServices().history.saveState(map);
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
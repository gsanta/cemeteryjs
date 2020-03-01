import { CanvasController } from "../CanvasController";
import { ServiceLocator } from "../../ServiceLocator";
import { Events } from "../../common/Events";

export enum UpdateTask {
    RepaintCanvas = 'RepaintCanvas',
    RepaintSettings = 'RepaintSettings',
    UpdateRenderer = 'UpdateRenderer',
    SaveData = 'SaveData',
    All = 'All'
}

export class CanvasUpdateService {

    toolUpdateTasks: UpdateTask[] = [];

    private controller: CanvasController;
    private services: ServiceLocator;

    constructor(controller: CanvasController, services: ServiceLocator) {
        this.controller = controller;
        this.services = services;
    }


    addUpdateTasks(...tasks: UpdateTask[]) {
        this.toolUpdateTasks = tasks;
    }

    runUpdateTaks(){
        this.toolUpdateTasks.forEach(task => {
            switch(task) {
                case UpdateTask.RepaintCanvas:
                    this.controller.renderWindow();
                break;
                case UpdateTask.RepaintSettings:
                    this.controller.renderToolbar();
                break;
                case UpdateTask.UpdateRenderer:
                    this.controller.editor.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
                break;
                case UpdateTask.SaveData:
                    this.services.storageService().saveXml(this.controller.exporter.export());
                break;
                case UpdateTask.All:
                    this.controller.renderWindow();
                    this.controller.renderToolbar();
                    this.controller.editor.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
                    this.services.storageService().saveXml(this.controller.exporter.export());
                break;
            }
        });
        this.toolUpdateTasks = [];
    }
}